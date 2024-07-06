import { Marker } from "react-leaflet";
import { useState, useEffect, useCallback, useRef, forwardRef } from "react";
/* @ts-ignore */
export const RotatedMarker = forwardRef<Marker, { children: React.ReactNode, rotationAngle?: number, rotationOrigin?: string }>(({ children, ...props }, forwardRef) => {
    const markerRef = useRef<typeof Marker>(null);
  
    const { rotationAngle, rotationOrigin } = props;
    useEffect(() => {
      const marker = markerRef.current;
      if (marker) {
        /* @ts-ignore */
        marker.setRotationAngle(rotationAngle);
        /* @ts-ignore */
        marker.setRotationOrigin(rotationOrigin);
      }
    }, [rotationAngle, rotationOrigin]);
  
    return (
      /* @ts-ignore */
      <Marker
        ref={(ref) => {
          /* @ts-ignore */
          markerRef.current = ref;
          if (forwardRef) {
            /* @ts-ignore */
            forwardRef.current = ref;
          }
        }}
        {...props}
      >
        {children}
      </Marker>
    );
  });