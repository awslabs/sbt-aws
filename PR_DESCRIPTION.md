# Fix: Remove iframe embeds to comply with privacy laws

## Summary
Fixes iframe privacy compliance issue (V1904543053) by removing embedded YouTube videos that set cookies without user consent.

## Changes Made
- ✅ Replaced `ReactPlayer` with privacy-compliant `VideoThumbnail` component
- ✅ Removed `react-player` dependency that creates iframes with cookies
- ✅ Use static YouTube thumbnails that link externally instead of embedding
- ✅ Eliminate automatic cookie setting to comply with US state privacy laws
- ✅ Maintain user experience with hover effects and clear external link indicators

## Privacy Compliance
- **Before:** ReactPlayer created iframes that automatically set YouTube cookies
- **After:** Static thumbnails with external links - no cookies set until user clicks
- **Result:** Full compliance with US state privacy laws and AWS Privacy Legal requirements

## Technical Details
The previous implementation used `ReactPlayer` which internally creates iframes to embed YouTube videos. These iframes automatically set cookies without user consent, violating privacy regulations.

The new implementation:
1. Uses YouTube's thumbnail API (`img.youtube.com/vi/{videoId}/maxresdefault.jpg`) 
2. Creates clickable thumbnails that open YouTube in new tabs
3. Only sets cookies when users explicitly click to watch videos
4. Maintains visual appeal with hover effects and play button overlay

## Testing
- [x] Component renders correctly with video thumbnails
- [x] External links open YouTube in new tabs with `target="_blank" rel="noopener noreferrer"`
- [x] No iframes or automatic cookie setting
- [x] Responsive design maintained across devices
- [x] Accessibility labels included (`aria-label` attributes)
- [x] TypeScript types properly defined

## Files Changed
- `website/src/pages/index.tsx` - Replaced ReactPlayer with VideoThumbnail component
- `website/src/pages/index.module.css` - Added privacy-compliant styling with hover effects
- `website/package.json` - Removed react-player dependency

## Screenshots
The new implementation shows attractive video thumbnails with play buttons that clearly indicate they will open YouTube externally when clicked.

Resolves: V1904543053