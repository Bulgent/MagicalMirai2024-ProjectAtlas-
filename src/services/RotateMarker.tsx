import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import { Marker } from 'react-leaflet';
/*@ts-ignore */
export const RotateMarker = forwardRef(({ children, icon, pane, rotationAngle, rotationOrigin, ...props }, ref) => {
  const markerRef = useRef(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      marker.setRotationAngle(-rotationAngle);
      marker.setRotationOrigin(-rotationOrigin);
    }
  }, [rotationAngle, rotationOrigin]);

  useImperativeHandle(ref, () => ({
    getLeafletElement: () => markerRef.current,
  }));

  return (
    /*@ts-ignore */
    <Marker
      ref={markerRef}
      icon={icon}
      {...props}
      pane={pane}
    >
      {children}
    </Marker>
  );
});