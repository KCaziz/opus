/**
 * Renders any CV template component at full A4 size (794px wide) then scales
 * it down via CSS transform to fit the preview card.
 *
 * This guarantees the preview looks pixel-identical to the real CV — no
 * separate "thumbnail" component needed.
 */
import React from 'react';
export const TEMPLATE_W = 794   // A4 at 96 dpi
export const TEMPLATE_H = 1123  // A4 ratio

export default function TemplatePreview({ component: CV, data, accentColor, previewWidth = 240 }) {
  const scale = previewWidth / TEMPLATE_W
  const previewHeight = TEMPLATE_H * scale

  return (
    <div
      style={{
        width: previewWidth,
        height: previewHeight,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 8,
        boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: TEMPLATE_W,
          height: TEMPLATE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <CV data={data} accentColor={accentColor} />
      </div>
    </div>
  )
}
