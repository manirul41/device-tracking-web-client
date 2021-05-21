import React, { Component } from 'react';

export const ROLE_ADMIN = 'admin';
export const ROLE_OWNER = 'owner';
export const ROLE_DRIVER = 'driver';
export const ROLE_PASSENGER = 'passenger';
export const ROLE_DISTRIBUTOR = 'distributor';

export const PAGINATION_MAX_PAGE_RANGE = 10;
export const USER_PERPAGE_PAGINATION_VALUE = 100;
export const DRIVER_PERPAGE_PAGINATION_VALUE = 100;
export const OWNER_PERPAGE_PAGINATION_VALUE = 100;
export const VEHICLE_PERPAGE_PAGINATION_VALUE = 100;
export const PASSENGER_PERPAGE_PAGINATION_VALUE = 100;
export const DISTRIBUTOR_PERPAGE_PAGINATION_VALUE = 100;
export const PROMOCODE_PERPAGE_PAGINATION_VALUE = 100;

export function loadingAnimation(msg) {
    return (
        <div className='pt-5 text-center text-secondary'>
            <span
                className="alert-success pl-3 pr-4 loading_dots"
                style={{ fontSize: '30px', borderRadius: '5px' }}
            >
                {msg}
            </span>
        </div>);
}

