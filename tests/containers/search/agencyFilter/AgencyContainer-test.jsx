/**
 * AgencyContainer-test.jsx
 * Created by michaelbray on 2/6/17.
 */

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { AgencyContainer } from 'containers/search/filters/AgencyContainer';

const initialFilters = {
    selectedAwardingAgencies: {},
    selectedFundingAgencies: {}
};

const agency = {
    id: 1788,
    create_date: "2017-01-12T19:56:30.517000Z",
    update_date: "2017-01-12T19:56:30.517000Z",
    toptier_agency: {
        toptier_agency_id: 268,
        create_date: "2017-01-31T21:25:39.810344Z",
        update_date: "2017-01-31T21:25:39.936439Z",
        cgac_code: "097",
        fpds_code: "9700",
        name: "DEPT OF DEFENSE"
    },
    subtier_agency: {
        subtier_agency_id: 1654,
        create_date: "2017-01-31T21:25:39.569918Z",
        update_date: "2017-01-31T21:25:39.691244Z",
        subtier_code: "1700",
        name: "DEPT OF THE NAVY"
    },
    office_agency: null
};

describe('AgencyContainer', () => {
    describe('Handling adding and removing agencies', () => {
        it('should add a Funding agency that has been selected to Redux', () => {
            const mockReduxActionFunding = jest.fn((args) => {
                expect(args).toEqual({
                    agency: {
                        id: 1788,
                        create_date: "2017-01-12T19:56:30.517000Z",
                        update_date: "2017-01-12T19:56:30.517000Z",
                        toptier_agency: {
                            toptier_agency_id: 268,
                            create_date: "2017-01-31T21:25:39.810344Z",
                            update_date: "2017-01-31T21:25:39.936439Z",
                            cgac_code: "097",
                            fpds_code: "9700",
                            name: "DEPT OF DEFENSE"
                        },
                        subtier_agency: {
                            subtier_agency_id: 1654,
                            create_date: "2017-01-31T21:25:39.569918Z",
                            update_date: "2017-01-31T21:25:39.691244Z",
                            subtier_code: "1700",
                            name: "DEPT OF THE NAVY"
                        },
                        office_agency: null
                    }
                });
            });

            // Set up container with mocked agency action
            const agencyContainer = shallow(
                <AgencyContainer
                    reduxFilters={initialFilters}
                    updateSelectedFundingAgencies={mockReduxActionFunding} />);

            const selectAgencySpy = sinon.spy(agencyContainer.instance(),
                'selectAgency');

            // Add Agency to redux
            agencyContainer.instance().selectAgency(agency, true, 'Funding');

            // everything should be updated now
            expect(selectAgencySpy.callCount).toEqual(1);
            expect(mockReduxActionFunding).toHaveBeenCalled();

            // reset the spies
            selectAgencySpy.reset();
        });

        it('should remove a Funding agency that has been deselected from Redux', () => {
            const mockReduxActionFunding = jest.fn((args) => {
                expect(args).toEqual({
                    agency: {
                        id: 1788,
                        create_date: "2017-01-12T19:56:30.517000Z",
                        update_date: "2017-01-12T19:56:30.517000Z",
                        toptier_agency: {
                            toptier_agency_id: 268,
                            create_date: "2017-01-31T21:25:39.810344Z",
                            update_date: "2017-01-31T21:25:39.936439Z",
                            cgac_code: "097",
                            fpds_code: "9700",
                            name: "DEPT OF DEFENSE"
                        },
                        subtier_agency: {
                            subtier_agency_id: 1654,
                            create_date: "2017-01-31T21:25:39.569918Z",
                            update_date: "2017-01-31T21:25:39.691244Z",
                            subtier_code: "1700",
                            name: "DEPT OF THE NAVY"
                        },
                        office_agency: null
                    }
                });
            });

            // Set up container with mocked agency action
            const agencyContainer = shallow(
                <AgencyContainer
                    reduxFilters={initialFilters}
                    updateSelectedFundingAgencies={mockReduxActionFunding} />);

            const selectAgencySpy = sinon.spy(agencyContainer.instance(),
                'selectAgency');
            const removeAgencySpy = sinon.spy(agencyContainer.instance(),
                'removeAgency');

            // Add Agency to redux
            agencyContainer.instance().selectAgency(agency, true, 'Funding');

            // Remove Agency from Redux
            agencyContainer.instance().removeAgency(agency, 'Funding');

            // everything should be updated now
            expect(selectAgencySpy.callCount).toEqual(1);
            expect(removeAgencySpy.callCount).toEqual(1);
            expect(mockReduxActionFunding).toHaveBeenCalledTimes(2);

            // reset the spies
            selectAgencySpy.reset();
            removeAgencySpy.reset();
        });

        it('should add a Awarding agency that has been selected to Redux', () => {
            const mockReduxActionAwarding = jest.fn((args) => {
                expect(args).toEqual({
                    agency: {
                        id: 1788,
                        create_date: "2017-01-12T19:56:30.517000Z",
                        update_date: "2017-01-12T19:56:30.517000Z",
                        toptier_agency: {
                            toptier_agency_id: 268,
                            create_date: "2017-01-31T21:25:39.810344Z",
                            update_date: "2017-01-31T21:25:39.936439Z",
                            cgac_code: "097",
                            fpds_code: "9700",
                            name: "DEPT OF DEFENSE"
                        },
                        subtier_agency: {
                            subtier_agency_id: 1654,
                            create_date: "2017-01-31T21:25:39.569918Z",
                            update_date: "2017-01-31T21:25:39.691244Z",
                            subtier_code: "1700",
                            name: "DEPT OF THE NAVY"
                        },
                        office_agency: null
                    }
                });
            });

            // Set up container with mocked agency action
            const agencyContainer = shallow(
                <AgencyContainer
                    reduxFilters={initialFilters}
                    updateSelectedAwardingAgencies={mockReduxActionAwarding} />);

            const selectAgencySpy = sinon.spy(agencyContainer.instance(),
                'selectAgency');

            // Add Agency to redux
            agencyContainer.instance().selectAgency(agency, true, 'Awarding');

            // everything should be updated now
            expect(selectAgencySpy.callCount).toEqual(1);
            expect(mockReduxActionAwarding).toHaveBeenCalled();

            // reset the spies
            selectAgencySpy.reset();
        });

        it('should remove a Awarding agency that has been deselected from Redux', () => {
            const mockReduxActionAwarding = jest.fn((args) => {
                expect(args).toEqual({
                    agency: {
                        id: 1788,
                        create_date: "2017-01-12T19:56:30.517000Z",
                        update_date: "2017-01-12T19:56:30.517000Z",
                        toptier_agency: {
                            toptier_agency_id: 268,
                            create_date: "2017-01-31T21:25:39.810344Z",
                            update_date: "2017-01-31T21:25:39.936439Z",
                            cgac_code: "097",
                            fpds_code: "9700",
                            name: "DEPT OF DEFENSE"
                        },
                        subtier_agency: {
                            subtier_agency_id: 1654,
                            create_date: "2017-01-31T21:25:39.569918Z",
                            update_date: "2017-01-31T21:25:39.691244Z",
                            subtier_code: "1700",
                            name: "DEPT OF THE NAVY"
                        },
                        office_agency: null
                    }
                });
            });

            // Set up container with mocked agency action
            const agencyContainer = shallow(
                <AgencyContainer
                    reduxFilters={initialFilters}
                    updateSelectedAwardingAgencies={mockReduxActionAwarding} />);

            const selectAgencySpy = sinon.spy(agencyContainer.instance(),
                'selectAgency');
            const removeAgencySpy = sinon.spy(agencyContainer.instance(),
                'removeAgency');

            // Add Agency to redux
            agencyContainer.instance().selectAgency(agency, true, 'Awarding');

            // Remove Agency from Redux
            agencyContainer.instance().removeAgency(agency, 'Awarding');

            // everything should be updated now
            expect(selectAgencySpy.callCount).toEqual(1);
            expect(removeAgencySpy.callCount).toEqual(1);
            expect(mockReduxActionAwarding).toHaveBeenCalledTimes(2);

            // reset the spies
            selectAgencySpy.reset();
            removeAgencySpy.reset();
        });
    });
});
