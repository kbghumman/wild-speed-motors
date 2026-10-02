create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  visitor_id uuid not null,
  session_id uuid not null,
  event_name text not null check (char_length(event_name) between 1 and 80),
  path text not null default '/' check (char_length(path) <= 500),
  vehicle_slug text,
  properties jsonb not null default '{}'::jsonb,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  device_type text,
  browser text,
  os text,
  language text,
  viewport_width integer,
  viewport_height integer,
  country_code text,
  region_code text
);

create index if not exists analytics_events_occurred_at_idx on public.analytics_events (occurred_at desc);
create index if not exists analytics_events_event_name_time_idx on public.analytics_events (event_name, occurred_at desc);
create index if not exists analytics_events_vehicle_time_idx on public.analytics_events (vehicle_slug, occurred_at desc) where vehicle_slug is not null;
create index if not exists analytics_events_visitor_time_idx on public.analytics_events (visitor_id, occurred_at desc);
create index if not exists analytics_events_session_time_idx on public.analytics_events (session_id, occurred_at desc);

alter table public.analytics_events enable row level security;

drop policy if exists "staff can read analytics" on public.analytics_events;
create policy "staff can read analytics" on public.analytics_events for select to authenticated using (private.is_staff());

revoke insert, update, delete on public.analytics_events from anon, authenticated;

create or replace function public.record_analytics_event(
  p_visitor_id uuid, p_session_id uuid, p_event_name text, p_path text default '/',
  p_vehicle_slug text default null, p_properties jsonb default '{}'::jsonb,
  p_referrer_host text default null, p_utm_source text default null,
  p_utm_medium text default null, p_utm_campaign text default null,
  p_utm_content text default null, p_utm_term text default null,
  p_device_type text default null, p_browser text default null, p_os text default null,
  p_language text default null, p_viewport_width integer default null,
  p_viewport_height integer default null, p_country_code text default null,
  p_region_code text default null
)
returns void language plpgsql security definer set search_path = public, private
as $$
begin
  if p_visitor_id is null or p_session_id is null then return; end if;
  if p_event_name is null or char_length(p_event_name) < 1 or char_length(p_event_name) > 80 or p_event_name !~ '^[a-z0-9_]+$' then return; end if;
  if pg_column_size(coalesce(p_properties, '{}'::jsonb)) > 16384 then return; end if;

  insert into public.analytics_events (
    visitor_id, session_id, event_name, path, vehicle_slug, properties,
    referrer_host, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    device_type, browser, os, language, viewport_width, viewport_height,
    country_code, region_code
  ) values (
    p_visitor_id, p_session_id, left(coalesce(p_event_name,''),80),
    left(coalesce(nullif(p_path,''),'/'),500), left(nullif(p_vehicle_slug,''),180),
    coalesce(p_properties,'{}'::jsonb), left(nullif(p_referrer_host,''),255),
    left(nullif(p_utm_source,''),180), left(nullif(p_utm_medium,''),180),
    left(nullif(p_utm_campaign,''),180), left(nullif(p_utm_content,''),180),
    left(nullif(p_utm_term,''),180), left(nullif(p_device_type,''),40),
    left(nullif(p_browser,''),80), left(nullif(p_os,''),80),
    left(nullif(p_language,''),40),
    case when p_viewport_width between 1 and 10000 then p_viewport_width else null end,
    case when p_viewport_height between 1 and 10000 then p_viewport_height else null end,
    left(nullif(p_country_code,''),8), left(nullif(p_region_code,''),32)
  );
end;
$$;

revoke all on function public.record_analytics_event(uuid,uuid,text,text,text,jsonb,text,text,text,text,text,text,text,text,text,text,integer,integer,text,text) from public;
grant execute on function public.record_analytics_event(uuid,uuid,text,text,text,jsonb,text,text,text,text,text,text,text,text,text,text,integer,integer,text,text) to anon, authenticated;

create or replace function public.get_analytics_dashboard(p_days integer default 30)
returns jsonb language plpgsql security definer set search_path = public, private
as $$
declare
  v_days integer := least(greatest(coalesce(p_days,30),1),365);
  result jsonb;
begin
  if not private.is_staff() then raise exception 'not authorized'; end if;

  with events as (
    select * from public.analytics_events where occurred_at >= now() - make_interval(days => v_days)
  ),
  summary as (
    select
      count(distinct visitor_id)::int visitors,
      count(distinct session_id)::int sessions,
      count(*) filter (where event_name='page_view')::int page_views,
      count(*) filter (where event_name='vehicle_view')::int vehicle_views,
      count(*) filter (where event_name in ('smart_search_submit','filter_search_submit'))::int searches,
      count(*) filter (where event_name='voice_search_completed')::int voice_searches,
      count(*) filter (where event_name in ('enquiry_click','test_drive_click','finance_click','trade_in_click'))::int intent_actions,
      count(*) filter (where event_name='enquiry_click')::int enquiry_clicks,
      count(*) filter (where event_name='test_drive_click')::int test_drive_clicks,
      count(*) filter (where event_name='finance_click')::int finance_clicks,
      count(*) filter (where event_name like 'gallery_%')::int gallery_actions
    from events
  ),
  daily as (
    select date_trunc('day',occurred_at)::date day,
      count(distinct visitor_id)::int visitors,
      count(distinct session_id)::int sessions,
      count(*) filter (where event_name='vehicle_view')::int vehicle_views,
      count(*) filter (where event_name in ('enquiry_click','test_drive_click','finance_click','trade_in_click'))::int intent_actions
    from events group by 1 order by 1
  ),
  vehicle_stats as (
    select vehicle_slug,
      max(coalesce(properties->>'make','')) make,
      max(coalesce(properties->>'model','')) model,
      count(*) filter (where event_name='vehicle_view')::int views,
      count(distinct visitor_id) filter (where event_name='vehicle_view')::int unique_viewers,
      count(*) filter (where event_name like 'gallery_%')::int gallery_actions,
      count(*) filter (where event_name='enquiry_click')::int enquiries,
      count(*) filter (where event_name='test_drive_click')::int test_drives,
      count(*) filter (where event_name='finance_click')::int finance_clicks
    from events where vehicle_slug is not null group by vehicle_slug
    order by views desc, unique_viewers desc limit 20
  ),
  searches as (
    select lower(trim(properties->>'query')) query, count(*)::int searches,
      avg(nullif(properties->>'result_count','')::numeric) avg_results,
      count(*) filter (where coalesce((properties->>'result_count')::int,0)=0)::int zero_result_count
    from events
    where event_name='smart_search_results' and coalesce(trim(properties->>'query'),'')<>''
    group by 1 order by searches desc, zero_result_count desc limit 25
  ),
  sources as (
    select coalesce(nullif(utm_source,''),nullif(referrer_host,''),'Direct') source,
      count(distinct visitor_id)::int visitors, count(distinct session_id)::int sessions
    from events where event_name='page_view'
    group by 1 order by visitors desc limit 15
  ),
  devices as (
    select coalesce(nullif(device_type,''),'Unknown') device,
      count(distinct visitor_id)::int visitors
    from events where event_name='page_view'
    group by 1 order by visitors desc
  ),
  top_pages as (
    select path, count(*)::int views, count(distinct visitor_id)::int visitors
    from events where event_name='page_view'
    group by path order by views desc limit 20
  ),
  countries as (
    select coalesce(nullif(country_code,''),'Unknown') country,
      count(distinct visitor_id)::int visitors
    from events where event_name='page_view'
    group by 1 order by visitors desc limit 15
  ),
  recent as (
    select occurred_at,event_name,path,vehicle_slug,properties
    from events order by occurred_at desc limit 50
  )
  select jsonb_build_object(
    'days',v_days,
    'summary',(select to_jsonb(summary) from summary),
    'daily',coalesce((select jsonb_agg(to_jsonb(daily) order by day) from daily),'[]'::jsonb),
    'vehicles',coalesce((select jsonb_agg(to_jsonb(vehicle_stats)) from vehicle_stats),'[]'::jsonb),
    'searches',coalesce((select jsonb_agg(to_jsonb(searches)) from searches),'[]'::jsonb),
    'sources',coalesce((select jsonb_agg(to_jsonb(sources)) from sources),'[]'::jsonb),
    'devices',coalesce((select jsonb_agg(to_jsonb(devices)) from devices),'[]'::jsonb),
    'pages',coalesce((select jsonb_agg(to_jsonb(top_pages)) from top_pages),'[]'::jsonb),
    'countries',coalesce((select jsonb_agg(to_jsonb(countries)) from countries),'[]'::jsonb),
    'recent',coalesce((select jsonb_agg(to_jsonb(recent)) from recent),'[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.get_analytics_dashboard(integer) from public;
grant execute on function public.get_analytics_dashboard(integer) to authenticated;
