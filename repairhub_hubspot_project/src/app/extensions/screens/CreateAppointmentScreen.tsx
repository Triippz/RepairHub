import * as React from "react";
import {Button, DateInput, Divider, EmptyState, Flex, Form, LoadingSpinner, Select, Text} from "@hubspot/ui-extensions";
import BreadCrumbs from "../components/BreadCrumbs";
import {Routes, useNavigation} from "../routing/useRouting";
import {AppointmentScheduleRequest, defaultAppointmentScheduleRequest} from "../models/dtos/appointment-schedule-request.dto";
import {AppointmentType} from "../models/entities/appointment.entity";
import {enumCaseToTitleCase} from "../utils/string.utils";
import {ServiceTechnician} from "../models/entities/service-technician.entity";
import {BaseDate} from "@hubspot/ui-extensions";
import {defaultSvcTechAvailibilityResponse, SvcTechAvailibilityResponse, TimeSlot} from "../models/dtos/svc-tech-availability.response";
import ScheduleSelection from "../components/ScheduleSelection";
import {useContext} from "react";
import {Context} from "../Context";

export interface CreateAppointmentScreenProps {
    context: any;
    runServerlessFunction: any;
    actions: any;
}

type ValidationErrorsType = {
    technician?: string | null;
    appointmentType?: string | null;
}

type ServerErrorsType = {
    getTechs: string | null;
    createAppointment: string | null;
}

type LoadingStatesType = {
    techs: boolean;
    createAppointment: boolean;
    techSchedule: boolean;
}

const CreateAppointmentScreen: React.FC<CreateAppointmentScreenProps> = ({context, runServerlessFunction, actions}) => {
    const {navigateTo} = useNavigation();
    const {hubspotUser} = useContext(Context);

    const [createAppointment, setCreateAppointment] =
        React.useState<AppointmentScheduleRequest>(defaultAppointmentScheduleRequest);
    const [validationErrors, setValidationErrors] =
        React.useState<ValidationErrorsType>({});
    const [serverErrors, setServerErrors] =
        React.useState<ServerErrorsType>({
            getTechs: null,
            createAppointment: null,
        });
    const [appointmentDate, setAppointmentDate] = React.useState<BaseDate>({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        date: new Date().getDate(),
    });
    const [techSchedule, setTechSchedule] =
        React.useState<SvcTechAvailibilityResponse>(defaultSvcTechAvailibilityResponse);
    const [isValid, setIsValid] = React.useState<boolean>(true);
    const [techs, setTechs] = React.useState<ServiceTechnician[]>([]);
    const [selectedTechnicianId, setSelectedTechnicianId] = React.useState<number>();
    const [loadingStates, setLoadingStates] = React.useState<LoadingStatesType>({
        techs: false,
        createAppointment: false,
        techSchedule: false
    });
    const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<TimeSlot>();

    const getTechs = React.useCallback(async () => {
        setLoadingStates({...loadingStates, techs: true});
        runServerlessFunction({
            name: 'getTechnicians'
        }).then((resp) => {
            if (resp.response.status === "SUCCESS") {
                setTechs(resp.response.body);
            } else {
                setServerErrors({...serverErrors, getTechs: resp.response.body});
            }
        });
        setLoadingStates({...loadingStates, techs: false});
    }, []);

    React.useEffect(() => {
        getTechs();
    }, []);

    const getTechSchedule = React.useCallback(async () => {
        setLoadingStates({...loadingStates, techSchedule: true});
        runServerlessFunction({
            name: 'getTechnicianAvailability',
            parameters: {
                svcTechId: selectedTechnicianId,
                serviceDate: appointmentDate
            }
        }).then((resp) => {
            if (resp.response.status === "SUCCESS") {
                console.log(resp.response.body)
                setTechSchedule(resp.response.body);
            } else {
                setServerErrors({...serverErrors, getTechs: resp.response.body});
            }
        });
        setLoadingStates({...loadingStates, techSchedule: false});
    }, [selectedTechnicianId]);

    React.useEffect(() => {
        setSelectedTimeSlot(undefined);
        if (selectedTechnicianId) {
            getTechSchedule();
        }
    }, [selectedTechnicianId, appointmentDate]);

    const createNewAppointment = React.useCallback(async () => {
        if (!selectedTechnicianId || !selectedTimeSlot) {
            return;
        }

        setLoadingStates({...loadingStates, createAppointment: true});
        const appointmentObj = {
            appointmentType: createAppointment.appointmentType,
            durationInMinutes: createAppointment.durationInMinutes,
            serviceTechnicianId: selectedTechnicianId,
            startTime: selectedTimeSlot?.startTime,
        }
        runServerlessFunction({
            name: 'createAppointment',
            parameters: {
                hubspotUserId: hubspotUser.id,
                appointment: appointmentObj
            }
        }).then((resp) => {
            if (resp.response.status === "SUCCESS") {
                actions.addAlert({
                    type: "success",
                    message: "Appointment Created Successfully"
                })
                navigateTo(Routes.HOME);
            } else {
                setServerErrors({...serverErrors, createAppointment: resp.response.body});
            }
        });
        setLoadingStates({...loadingStates, createAppointment: false});
    }, [selectedTechnicianId, selectedTimeSlot, createAppointment]);

    const _renderTechSchedule = () => {
        if (!selectedTechnicianId) {
            return (
                <Flex justify="center">
                    <EmptyState title="Select a Tech to View Their schedules" layout="vertical" reverseOrder={true}>
                    </EmptyState>
                </Flex>
            )
        }

        if (techSchedule.isOff) {
            return (
                <Flex direction="column" align="center">
                    <Text format={{fontWeight: "bold"}}>This technician is off on this day</Text>
                </Flex>
            )
        } else if (!techSchedule.isAvailable) {
            return (
                <Flex direction="column" align="center">
                    <Text format={{fontWeight: "bold"}}>This technician is not available on this day</Text>
                </Flex>
            )
        } else {
            return (
                <Flex direction="column" align="center">
                    <Text>Available Time Slots</Text>
                    <ScheduleSelection
                        availableTimeSlots={techSchedule.availableTimeSlots}
                        occupiedTimeSlots={techSchedule.occupiedTimeSlots}
                        selectedTimeSlot={selectedTimeSlot}
                        onScheduleSelect={(timeSlot: TimeSlot) => {
                            setSelectedTimeSlot(timeSlot);
                        }}
                    />
                </Flex>
            )
        }
    }

    return (
        <Flex direction={"column"} justify={'start'} gap={"sm"}>
            <BreadCrumbs
                crumbs={[
                    {label: "Home", screen: Routes.HOME, active: false},
                    {label: "Schedule Appointment", screen: null, active: true}
                ]}
            />

            <Text format={{
                fontWeight: "demibold"
            }}>Schedule A New Appointment</Text>
            <Divider distance="large"/>

            <Form>
                <Flex direction="row" justify="between">
                    <Flex direction="column" align={'start'} gap={"sm"}>
                        <Select
                            label="What type of appointment would you like to schedule?"
                            name="appointmentType"
                            error={!isValid}
                            validationMessage={validationErrors?.appointmentType}
                            required={true}
                            onChange={(value) => {
                                setCreateAppointment({...createAppointment, appointmentType: AppointmentType[value]})
                                if (!value) {
                                    setValidationErrors({...validationErrors, appointmentType: "Please select an appointment type"})
                                    setIsValid(false);
                                } else {
                                    setValidationErrors({...validationErrors, appointmentType: null})
                                    setIsValid(true);
                                }
                            }}
                            options={Object.keys(AppointmentType).map((key) => {
                                return {label: enumCaseToTitleCase(AppointmentType[key]), value: AppointmentType[key]}
                            })}
                        />

                        <DateInput
                            label="Appointment Date"
                            name="appointmentDate"
                            onChange={(value) => {
                                setAppointmentDate(value)
                            }}
                            value={appointmentDate}
                            required={true}
                            min={{
                                year: new Date().getFullYear(),
                                month: new Date().getMonth(),
                                date: new Date().getDate(),
                            }}
                            format="L"
                        />

                        {loadingStates?.techs
                            ? (
                                <LoadingSpinner label="Loading Technicians..." showLabel={true} layout="centered"/>
                            )
                            : (
                                <Select
                                    label="Select a Technician"
                                    name="technician"
                                    error={!isValid}
                                    validationMessage={validationErrors?.technician}
                                    required={true}
                                    onChange={(value: number) => {
                                        setSelectedTechnicianId(value);
                                        if (!value) {
                                            setValidationErrors({...validationErrors, technician: "Please select a technician"})
                                            setIsValid(false);
                                        } else {
                                            setValidationErrors({...validationErrors, technician: null})
                                            setIsValid(true);
                                        }
                                    }}
                                    options={techs.map((tech) => {
                                        return {
                                            label: `${tech.firstName} ${tech.lastName}`,
                                            value: tech.id
                                        }
                                    })}
                                />
                            )
                        }

                        <Button
                            disabled={!isValid || loadingStates.createAppointment || !selectedTimeSlot || !selectedTechnicianId}
                            onClick={() => createNewAppointment()}
                            variant="primary"
                        >
                            Schedule Appointment
                        </Button>
                    </Flex>

                    <Flex direction="column">
                        {_renderTechSchedule()}
                    </Flex>
                </Flex>
            </Form>
        </Flex>
    );
}

export default CreateAppointmentScreen;