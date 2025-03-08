import { useState, useEffect } from "react";
import moment from "moment";

import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";

function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Function to fetch teachers, optionally with a search query.
    const fetchTeachers = (query = "") => {
        useAxios.get(`teacher/teacher-lists/${UserData()?.teacher_id}/`, { params: { q: query } })
            .then((res) => {
                console.log("res.data: ", res.data);
                setTeachers(res.data);
            });
    };

    // Initial fetch with no search query.
    useEffect(() => {
        fetchTeachers("");
    }, []);

    // Handle the search form submission.
    const handleSearch = (e) => {
        e.preventDefault();
        fetchTeachers(searchQuery);
    };

    return (
        <>
            <BaseHeader />

            <section className="pt-5 pb-5">
                <div className="container">
                    <Header />
                    <div className="row mt-0 mt-md-4">
                        <Sidebar />
                        <div className="col-lg-9 col-md-8 col-12">
                            <div className="card mb-4">
                                <div className="p-4 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h3 className="mb-0">Teachers</h3>
                                        <span>Meet other teachers teaching other courses.</span>
                                    </div>
                                    {/* Search Bar */}
                                    <form onSubmit={handleSearch} className="d-flex">
                                        <input
                                            type="text"
                                            placeholder="Search teachers..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="form-control me-2"
                                        />
                                        <button type="submit" className="btn btn-primary">
                                            Search
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="row">
                                {teachers?.map((s, index) => (
                                    <div key={s.full_name + index} className="col-lg-4 col-md-6 col-12">
                                        <div className="card mb-4">
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
                                                    <span>Teaching {s.total_courses} courses</span>
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

export default Teachers;
