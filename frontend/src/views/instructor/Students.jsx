import { useState, useEffect } from "react";
import moment from "moment";
import Swal from "sweetalert2";  // Import Swal for modal

import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";

function Students() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        useAxios.get(`teacher/student-lists/${UserData()?.teacher_id}/`).then((res) => {
            console.log("res.data: ", res.data);
            setStudents(res.data);
        });
    }, []);

    const removeStudent = (studentUsername) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will remove the student from all your courses.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, remove",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await useAxios.delete(`teacher/remove-student/${UserData()?.teacher_id}/${studentUsername}/`);
                    
                    // Update UI after successful removal
                    setStudents(students.filter((s) => s.username !== studentUsername));

                    Swal.fire("Removed!", "The student has been removed.", "success");
                } catch (error) {
                    console.error("Error removing student:", error);
                    Swal.fire("Error!", "Failed to remove student.", "error");
                }
            }
        });
    };

    return (
        <>
            <BaseHeader />

            <section className="pt-5 pb-5">
                <div className="container">
                    {/* Header Here */}
                    <Header />
                    <div className="row mt-0 mt-md-4">
                        {/* Sidebar Here */}
                        <Sidebar />
                        <div className="col-lg-9 col-md-8 col-12">
                            {/* Card */}
                            <div className="card mb-4">
                                {/* Card body */}
                                <div className="p-4 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h3 className="mb-0">Students</h3>
                                        <span>Meet people taking your course.</span>
                                    </div>
                                    {/* Nav */}
                                </div>
                            </div>
                            {/* Tab content */}
                            <div className="row">
                                {students?.map((s, index) => (
                                    <div key={s.username} className="col-lg-4 col-md-6 col-12">
                                        <div className="card mb-4 position-relative">
                                            <button
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                                onClick={() => removeStudent(s.username)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                            <div className="card-body">
                                                <div className="text-center">
                                                    <img
                                                        src={`http://127.0.0.1:8000${s.image}`}
                                                        className="rounded-circle avatar-xl mb-3"
                                                        style={{
                                                            width: "70px",
                                                            height: "70px",
                                                            borderRadius: "50%",
                                                            objectFit: "cover",
                                                        }}
                                                        alt="avatar"
                                                    />
                                                    <h4 className="mb-1">{s.full_name}</h4>
                                                    <p className="mb-0">
                                                        <i className="fas fa-map-pin me-1" /> {s.country}
                                                    </p>
                                                </div>
                                                <div className="d-flex justify-content-between py-2 mt-4 fs-6">
                                                    <span>Enrolled</span>
                                                    <span className="text-dark">
                                                        {moment(s.date).format("DD MMM YYYY")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default Students;
