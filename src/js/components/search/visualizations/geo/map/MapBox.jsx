/**
 * MapBox.jsx
 * Created by Kevin Li 2/17/17
 */

import React, { useEffect, useState, useImperativeHandle, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import MapboxGL from 'mapbox-gl/dist/mapbox-gl';
import { throttle } from 'lodash';
import * as Icons from 'components/sharedComponents/icons/Icons';
import statesBySqMile from "dataMapping/state/statesBySqMile";

import kGlobalConstants from 'GlobalConstants';

const propTypes = {
    loadedMap: PropTypes.func,
    unloadedMap: PropTypes.func,
    center: PropTypes.array,
    stateProfile: PropTypes.bool,
    stateInfo: PropTypes.object,
    singleLocationSelected: PropTypes.object
};

// Define map movement increment
const delta = 100;

// define map sources
const mapStyle = 'mapbox://styles/usaspending/cj18cwjh300302slllhddyynm';

const MapBox = forwardRef((props, ref) => {
    let componentUnmounted = false;
    const map = useRef();
    const mapDiv = useRef(null);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showNavButtons, setShowNavButtons] = useState(false);
    const [zoom, setZoom] = useState(4);

    useImperativeHandle(ref, () => ({
        map
    }));


    const isStateSelected = () => {
        if (props.stateInfo?.code !== '' || (props.singleLocationSelected && Object.prototype.hasOwnProperty.call(props.singleLocationSelected, 'state'))) {
            return true;
        }
        return false;
    };

    const calculateMapZoom = () => {
        let zoomLevel = 3.2;

        if (isStateSelected()) {
            const stateCode = props.stateInfo?.code || props.singleLocationSelected?.state;
            let modifyZoom = 0;
            if (stateCode !== '') {
                if (Object.prototype.hasOwnProperty.call(props.singleLocationSelected, 'county') || Object.prototype.hasOwnProperty.call(props.singleLocationSelected, 'district') || Object.prototype.hasOwnProperty.call(props.singleLocationSelected, 'district_current')) {
                    modifyZoom = 2;
                }

                const state = statesBySqMile.find((s) => s.code === stateCode);
                if (state?.size > 500000) {
                    zoomLevel = 3.0 + modifyZoom;
                }
                else if (state?.size < 1000) {
                    zoomLevel = 9.6 + modifyZoom;
                }
                else if (state?.size < 10000) {
                    zoomLevel = 6.2 + modifyZoom;
                }
                else if (state?.size < 140000) {
                    zoomLevel = 4.8 + modifyZoom;
                }
            }
            zoomLevel = 4.2 + modifyZoom;
        }

        console.log(zoomLevel);

        setZoom(zoomLevel);
    };

    const moveMap = (bearing) => {
        map.current.panBy(bearing);
    };

    const moveUp = () => {
        moveMap([0, -delta]);
    };

    const moveLeft = () => {
        moveMap([-delta, 0]);
    };

    const moveRight = () => {
        moveMap([delta, 0]);
    };

    const moveDown = () => {
        moveMap([0, delta]);
    };

    const centerMap = (m) => {
        // if (typeof m?.current?.jumpTo === "function") {
            m?.current?.jumpTo({
                zoom: zoom || 4,
                center: props.center
            });
        // }
    };

    const resizeMap = () => {
        if (windowWidth < 768) {
            map.current.dragPan.disable();
            centerMap(map);
            setShowNavButtons(true);
        }
        else {
            map.current.dragPan.enable();
            setShowNavButtons(false);
        }
    };

    const mountMap = () => {
        MapboxGL.accessToken = kGlobalConstants.MAPBOX_TOKEN;
        map.current = new MapboxGL.Map({
            container: mapDiv.current,
            style: mapStyle,
            logoPosition: 'bottom-right',
            attributionControl: false,
            center: props.center,
            zoom: zoom,
            dragRotate: false // disable 3D view
        });

        // add navigation controls
        map.current.addControl(new MapboxGL.NavigationControl());
        map.current.addControl(new MapboxGL.AttributionControl({
            compact: false
        }));

        // disable the compass controls
        map.current.dragRotate.disable();

        let showNavigationButtons = false;
        if (windowWidth < 768) {
            showNavigationButtons = true;
            map.current.dragPan.disable();
            centerMap(map);
        }

        // disable scroll zoom
        map.current.scrollZoom.disable();

        // prepare the shapes
        map.current.on('load', () => {
            if (componentUnmounted) {
                // don't update the state if the map has been unmounted
                return;
            }

            setShowNavButtons(showNavigationButtons);
            props.loadedMap(map);
        });
    };

    const handleWindowResize = throttle(() => {
        // determine if the width changed
        const currentWindowWidth = window.innerWidth;
        if (currentWindowWidth !== windowWidth) {
            // width changed, update the visualization width
            setWindowWidth(currentWindowWidth);
        }
    }, 16);

    useEffect(() => {
        componentUnmounted = false;
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
            props.unloadedMap();
            componentUnmounted = true;
        };
    }, []);

    const isCenterable = () => {
        if (props.stateProfile) {
            return false;
        }

        const isSingleLocation = props.center?.length > 0 && Object.prototype.hasOwnProperty.call(props, "singleLocationSelected") && Object.keys(props.singleLocationSelected)?.length > 0;
        return isSingleLocation;
    };

    useEffect(() => {
        if (isCenterable()) {
            centerMap(map);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.center, props.singleLocationSelected]);

    useEffect(() => {
        if (map.current) {
            resizeMap();
        }
        else {
            calculateMapZoom();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windowWidth, props.center]);

    useEffect(() => {
        if (zoom && !map.current) {
            mountMap();
        }
    }, [zoom]);

    return (
        <div
            className="mapbox-item"
            ref={(div) => {
                mapDiv.current = div;
            }}>
            <div className={`map-buttons ${showNavButtons ? '' : 'hide'}`}>
                <div className="first-row">
                    <button
                        onMouseDown={moveUp}
                        onTouchStart={moveUp}>
                        <Icons.AngleUp />
                    </button>
                </div>
                <div className="second-row">
                    <button
                        onMouseDown={moveLeft}
                        onTouchStart={moveLeft}>
                        <Icons.AngleLeft />
                    </button>
                    <button
                        onMouseDown={moveDown}
                        onTouchStart={moveDown}>
                        <Icons.AngleDown />
                    </button>
                    <button
                        onMouseDown={moveRight}
                        onTouchStart={moveRight}>
                        <Icons.AngleRight />
                    </button>
                </div>
            </div>
        </div>
    );
});

MapBox.propTypes = propTypes;

export default MapBox;
