import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import Selectbox from "@/Components/Selectbox";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SubmitAttendance() {
    const [transitioning, setTransitioning] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [alreadyAttended, setAlreadyAttended] = useState(false);

    const { data, setData, post, transform, errors, processing, reset, recentlySuccessful } =
        useForm({
            status: "attend",
            description: "",
            latitude: "",
            longitude: "",
            prepareData: {},
        });

    const submit = (e) => {
        e.preventDefault();

        navigator.geolocation.getCurrentPosition(
            function (position) {
                console.log("Latitude is:", position.coords.latitude);
                console.log("Longitude is:", position.coords.longitude);

                let objLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setData("prepareData", objLocation);
            },
            function (error) {
                alert("Anda berada di tempat tak dikenal");
            }
        );
    };

    useEffect(() => {
        axios.get(route('attendances.checkToday'))
            .then(response => {
                setAlreadyAttended(response.data.attended);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (data.prepareData.hasOwnProperty("latitude") &&
            data.prepareData.hasOwnProperty("longitude")
        ) {
            transform((data) => ({
                ...data.prepareData,
                status: data.status,
                description: data.description,
            }));

            post(route("attendances.submit"), {
                preserveScroll: true,
                onSuccess: () => {
                    reset(); // Reset form fields
                    setSubmitted(true); // Set submitted to true
                    setTimeout(() => setSubmitted(false), 3000); // Hide success message after 3 seconds
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
        }
    }, [data.prepareData]);

    useEffect(() => {
        if (data.status === "attend") {
            setTransitioning(false);
        } else {
            setTransitioning(true);
        }
    }, [data.status]);

    return (
        <form onSubmit={submit} className="mt-6 space-y-6">
            {alreadyAttended ? (
                <div className="alert alert-success">
                    Anda telah melakukan absensi hari ini.
                </div>
            ) : (
                <>
                    {submitted && (
                        <div className="alert alert-success">
                            Anda telah melakukan absensi.
                        </div>
                    )}

                    {!submitted && (
                        <>
                            <div>
                                <InputLabel htmlFor="info" value="Silahkan lakukan absensi" />

                                <Selectbox
                                    onChange={(e) => setData("status", e.target.value)}
                                    className="border border-gray-300 rounded-md"
                                    options={[
                                        { value: "attend", label: "Hadir" },
                                        { value: "leave", label: "Cuti" },
                                        { value: "sick", label: "Sakit" },
                                        { value: "permit", label: "Izin" },
                                        { value: "business_trip", label: "Perjalanan Dinas" },
                                        { value: "remote", label: "Hybrid/WFH" },
                                    ]}
                                />

                                <InputError className="mt-2" message={errors.status} />
                            </div>
                            <Transition
                                show={transitioning}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <div>
                                    <InputLabel htmlFor="description" value="Penjelasan" />

                                    <TextInput
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        className="w-full"
                                    />

                                    <InputError className="mt-2" message={errors.description} />
                                </div>
                            </Transition>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Absensi</PrimaryButton>
                            </div>
                        </>
                    )}
                </>
            )}
        </form>
    );
}