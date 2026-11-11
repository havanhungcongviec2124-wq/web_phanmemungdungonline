// frontend/src/utils/disableZoom.js
//
// Chặn zoom trên phiên bản mobile:
//  - Pinch zoom (chụm 2 ngón to/ nhỏ)
//  - iOS Safari bỏ qua "user-scalable=no" trong thẻ meta viewport,
//    nên phải chặn thêm bằng sự kiện gesture của Safari.
//  - Backup: chặn touchmove khi có nhiều hơn 1 ngón tay chạm màn hình.

export function disablePinchZoom() {
  if (typeof document === 'undefined') return;

  // 1) iOS Safari (điện thoại iPhone) — sự kiện gesture riêng của Safari
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((evt) => {
    document.addEventListener(evt, (e) => e.preventDefault());
  });

  // 2) Chặn kéo 2 ngón (pinch) trên các trình duyệt khác
  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length > 1) e.preventDefault();
    },
    { passive: false }
  );
}
