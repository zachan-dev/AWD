import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import useAxios from "../../utils/useAxios";
import ChatRoom from "../ChatRoom";

function CourseDetail() {
    const [course, setCourse] = useState([]);
    const [variantItem, setVariantItem] = useState(null);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const param = useParams();
    // Play Lecture Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (variant_item) => {
        setShow(true);
        setVariantItem(variant_item);
    };

     // Chat Modal state
    const [showChat, setShowChat] = useState(false);
    const handleShowChat = () => setShowChat(true);
    const handleCloseChat = () => setShowChat(false);

    const fetchCourseDetail = async () => {
        useAxios.get(`teacher/course-detail-preview/${param.course_id}/`).then((res) => {
            setCourse(res.data);
            setCompletionPercentage(100);
        });
    };
    useEffect(() => {
        fetchCourseDetail();
    }, []);

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
                            <section className="mt-4">
                                <div className="container">
                                    <div className="row">
                                        {/* Main content START */}
                                        <div className="col-12">
                                            <div className="card shadow rounded-2 p-0 mt-n5">
                                                {/* Tabs START */}
                                                <div className="card-header border-bottom px-4 pt-3 pb-0">
                                                    <ul className="nav nav-bottom-line py-0" id="course-pills-tab" role="tablist">
                                                        {/* Tab item */}
                                                        <li className="nav-item me-2 me-sm-4" role="presentation">
                                                            <button className="nav-link mb-2 mb-md-0 active" id="course-pills-tab-1" data-bs-toggle="pill" data-bs-target="#course-pills-1" type="button" role="tab" aria-controls="course-pills-1" aria-selected="true">
                                                                Course Lectures
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                                {/* Tabs END */}
                                                {/* Tab contents START */}
                                                <div className="card-body p-sm-4">
                                                    <div className="tab-content" id="course-pills-tabContent">
                                                        {/* Content START */}
                                                        <div className="tab-pane fade show active" id="course-pills-1" role="tabpanel" aria-labelledby="course-pills-tab-1">
                                                            {/* Accordion START */}
                                                            <div className="accordion accordion-icon accordion-border" id="accordionExample2">
                                                                <div className="progress mb-3">
                                                                    <div
                                                                        className="progress-bar"
                                                                        role="progressbar"
                                                                        style={{
                                                                            width: `${completionPercentage}%`,
                                                                        }}
                                                                        aria-valuenow={completionPercentage}
                                                                        aria-valuemin={0}
                                                                        aria-valuemax={100}
                                                                    >
                                                                        {completionPercentage}%
                                                                    </div>
                                                                </div>
                                                                {/* Item */}

                                                                {course?.curriculum?.map((c, index) => (
                                                                    <div className="accordion-item mb-3 p-3 bg-light">
                                                                        <h6 className="accordion-header font-base" id="heading-1">
                                                                            <button
                                                                                className="accordfion-button p-3 w-100 bg-light btn border fw-bold rounded d-sm-flex d-inline-block collapsed"
                                                                                type="button"
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target={`#collapse-${c.variant_id}`}
                                                                                aria-expanded="true"
                                                                                aria-controls={`collapse-${c.variant_id}`}
                                                                            >
                                                                                {c.title}
                                                                                <span className="small ms-0 ms-sm-2">
                                                                                    ({c.variant_items?.length} Lecture
                                                                                    {c.variant_items?.length > 1 && "s"})
                                                                                </span>
                                                                            </button>
                                                                        </h6>

                                                                        <div id={`collapse-${c.variant_id}`} className="accordion-collapse collapse show" aria-labelledby="heading-1" data-bs-parent="#accordionExample2">
                                                                            <div className="accordion-body mt-3">
                                                                                {/* Course lecture */}
                                                                                {c.variant_items?.map((l, index) => (
                                                                                    <>
                                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                                            <div className="position-relative d-flex align-items-center">
                                                                                                <button onClick={() => handleShow(l)} className="btn btn-danger-soft btn-round btn-sm mb-0 stretched-link position-static">
                                                                                                    <i className="fas fa-play me-0" />
                                                                                                </button>
                                                                                                <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-100px w-sm-200px w-md-400px">{l.title}</span>
                                                                                            </div>
                                                                                            <div className="d-flex">
                                                                                                <p className="mb-0">{l.content_duration || "0m 0s"}</p>
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="form-check-input ms-2"
                                                                                                    name=""
                                                                                                    id=""
                                                                                                    checked={course.completed_lesson?.some((cl) => cl.variant_item.id === l.id)}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <hr />
                                                                                    </>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {/* Accordion END */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Chat Button */}
            <div className="floating-chat-button" onClick={handleShowChat}>
                <i className="fas fa-comment-dots"></i>
            </div>

            {/* Lecture Modal */}
            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Lesson: {variantItem?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReactPlayer url={variantItem?.file} controls width={"100%"} height={"100%"} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Chat Modal */}
            <Modal show={showChat} onHide={handleCloseChat} centered>
                <Modal.Header closeButton>
                <Modal.Title>Course Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <ChatRoom courseId={course.course_id} role="Instructor" />
                </Modal.Body>
            </Modal>

            <BaseFooter />
        </>
    );
}

export default CourseDetail;
