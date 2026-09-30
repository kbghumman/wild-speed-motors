# Vehicle image upload standard

Wild Speed Motors uses an automatic high-quality image pipeline in the dealer console.

## Recommended capture

- Landscape orientation
- 4:3 aspect ratio
- Ideal source: 3200 × 2400 pixels or larger
- 15–30 photos per vehicle; maximum 40
- Use the original camera photos rather than screenshots or social-media copies

## What HQ Auto does

- JPEG, PNG and WebP files that are already 5 MB or smaller and no larger than 3200 px on the long edge are kept unchanged.
- Oversized images are resized to a maximum 3200 px long edge and encoded as high-quality WebP, beginning at quality 0.93.
- HEIC / HEIF is converted automatically in the browser before upload.
- AVIF and other browser-decodable image formats are normalized to WebP when needed.
- Very large source files can be selected up to 100 MB, but the generated upload is kept around 5 MB or less.
- Image processing happens locally in the dealer's browser before upload, reducing transfer time without sending the original giant file first.
- Up to four prepared photos upload in parallel.
- If one photo fails, successfully uploaded photos are retained and the next Save / Publish retries only the failed ones.

The public storefront uses a consistent 4:3 vehicle image frame.

## Quality rationale

A 3200 px long edge is enough for the site's large desktop presentation with headroom for high-density screens. The storefront then uses Next.js image optimization to deliver appropriately sized versions to each visitor.
