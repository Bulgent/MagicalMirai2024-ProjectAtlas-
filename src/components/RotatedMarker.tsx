import { Marker } from "react-leaflet";
import { useState, useEffect, useCallback, useRef, forwardRef } from "react";

export const RotatedMarker = forwardRef<Marker, { children: React.ReactNode, rotationAngle?: number, rotationOrigin?: string }>(({ children, ...props }, forwardRef) => {
    const markerRef = useRef<typeof Marker>(null);
  
    const { rotationAngle, rotationOrigin } = props;
    useEffect(() => {
      const marker = markerRef.current;
      if (marker) {
        marker.setRotationAngle(rotationAngle);
        marker.setRotationOrigin(rotationOrigin);
      }
    }, [rotationAngle, rotationOrigin]);
  
    return (
      <Marker
        ref={(ref) => {
          markerRef.current = ref;
          if (forwardRef) {
            forwardRef.current = ref;
          }
        }}
        {...props}
      >
        {children}
      </Marker>
    );
  });