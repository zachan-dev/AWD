import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Cookie from "js-cookie";

import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import { Link, useNavigate, useParams } from "react-router-dom";

import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";
import Swal from "sweetalert2";
import Toast from "../plugin/Toast";

function CourseEditCurriculum() {
    const param = useParams();
    const [variants, setVariants] = useState([
        {
            title: "", items: [{ title: "", description: "", file: "", preview: false }]
        }
    ]);

    const fetchCourseDetail = () => {
        useAxios.get(`teacher/course-detail/${param.course_id}/`).then((res) => {
            setVariants(res.data.curriculum);
        });
    };

    useEffect(() => {
        fetchCourseDetail();
    }, []);

    const handleVariantChange = (index, propertyName, value) => {
        const newVariants = [...variants];
        newVariants[index][propertyName] = value;
        setVariants(newVariants);

        console.log(`Name: ${propertyName} - value: ${value} - index: ${index}`);
    };

    const handleItemChange = (variantIndex, itemIndex, propertyName, value, type) => {
        const newVariants = [...variants];
        newVariants[variantIndex].items[itemIndex][propertyName] = value;
        setVariants(newVariants);

        console.log(`Name: ${propertyName} - value: ${value} - variantIndex: ${variantIndex} - itemIndex: ${itemIndex} - type: ${type}`);
    };

    const addVariant = () => {
        setVariants([...variants, {
            title: "",
            items: [{ title: "", description: "", file: "", preview: false }]
        }]);
    };

    const removeVariant = (index, variantId) => {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);

        useAxios.delete(`teacher/course/variant-delete/${variantId}/${UserData()?.teacher_id}/${param.course_id}/`).then((res) => {
            console.log(res.data);
            fetchCourseDetail();
            Toast().fire({
                icon: "success",
                title: "Lecture deleted",
            });
        });
    };

    const addItem = (variantIndex) => {
        const newVariants = [...variants];
        newVariants[variantIndex].items.push({ title: "", description: "", file: "", preview: false });
        setVariants(newVariants);
    };

    const removeItem = (variantIndex, itemIndex, variantId, itemId) => {
        const newVariants = [...variants];
        newVariants[variantIndex].items.splice(itemIndex, 1);
        setVariants(newVariants);

        useAxios.delete(`teacher/course/variant-item-delete/${variantId}/${itemId}/${UserData()?.teacher_id}/${param.course_id}/`).then((res) => {
            console.log(res.data);
            fetchCourseDetail();
            Toast().fire({
                icon: "success",
                title: "Lesson Item deleted",
            });
        });
    };

    const handleFileChange = (variantIndex, itemIndex, event) => {
        const selectedFile = event.target.files[0];
    
        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            updatedVariants[variantIndex].items[itemIndex] = {
                ...updatedVariants[variantIndex].items[itemIndex],
                file: selectedFile, // Update file for the correct item
            };
            return updatedVariants;
        });
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        variants.forEach((variant, variantIndex) => {
            Object.entries(variant).forEach(([key, value]) => {
                console.log(`Variant ${variantIndex} - ${key}: ${value}`);
                if (value instanceof File) {
                    formData.append(`variants[${variantIndex}][variant_${key}]`, value);
                } else {
                    formData.append(`variants[${variantIndex}][variant_${key}]`, String(value));
                }
            });

            variant.items.forEach((item, itemIndex) => {
                Object.entries(item).forEach(([itemKey, itemValue]) => {
                    console.log(`Item ${itemIndex} - ${itemKey}: ${itemValue}`);
                    if (itemValue instanceof File) {
                        formData.append(`variants[${variantIndex}][items][${itemIndex}][${itemKey}]`, itemValue);
                    } else {
                        formData.append(`variants[${variantIndex}][items][${itemIndex}][${itemKey}]`, String(itemValue));
                    }
                });
            });
        });

        
        try {
            const response = await useAxios.patch(
                `teacher/course-update/${UserData()?.teacher_id}/${param.course_id}/`, 
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                },
            );
            Swal.fire({
                icon: "success",
                title: "Course Updated Successfully",
            });
        } catch (error) {
            console.error("Error updating course:", error);
            Swal.fire({
                icon: "error",
                title: "Error updating course",
            });
        }
    };

    return (
        <>
            <BaseHeader />

            <section className="pt-5 pb-5">
                <div className="container">
                    <Header />
                    <div className="row mt-0 mt-md-4">
                        <Sidebar />
                        <form className="col-lg-9 col-md-8 col-12" onSubmit={handleSubmit}>
                            <>
                                <section className="pb-8 mt-5">
                                    <div className="card mb-3">
                                        {/* Curriculum Section */}
                                        <div className="card-header border-bottom px-4 py-3">
                                            <h4 className="mb-0">Curriculum</h4>
                                        </div>
                                        <div className="card-body ">
                                            {variants.map((variant, variantIndex) => (
                                                <div className='border p-2 rounded-3 mb-3' style={{ backgroundColor: "#ededed" }}>
                                                    <div className="d-flex mb-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Section Name"
                                                            required
                                                            className='form-control'
                                                            defaultValue={variant["title"]} 
                                                            onChange={(e) => handleVariantChange(variantIndex, "title", e.target.value)}
                                                        />
                                                        <button 
                                                            className='btn btn-danger ms-2'
                                                            type='button'
                                                            onClick={() => removeVariant(variantIndex, variant.variant_id)}
                                                        >
                                                            <i className='fas fa-trash'></i>
                                                        </button>
                                                    </div>

                                                    {variant.items.map((item, itemIndex) => (
                                                        <div className=' mb-2 mt-2 shadow p-2 rounded-3 ' style={{ border: "1px #bdbdbd solid" }}>
                                                            <input
                                                                type="text"
                                                                placeholder="Lesson Title"
                                                                className='form-control me-1 mt-2'
                                                                name='title'
                                                                defaultValue={variant.items[itemIndex]["title"]} 
                                                                onChange={(e) => handleItemChange(variantIndex, itemIndex, "title", e.target.value, e.target.type)}
                                                            />
                                                            <textarea name="" id="" cols="30" className='form-control mt-2' placeholder='Lesson Description' rows="4"
                                                                defaultValue={variant.items[itemIndex]["description"]} 
                                                                onChange={(e) => handleItemChange(variantIndex, itemIndex, "description", e.target.value, e.target.type)}>
                                                            </textarea>
                                                            <div className="row d-flex align-items-center">
                                                                <div className="col-lg-8">
                                                                    <input
                                                                        type="file"
                                                                        placeholder="Lesson File"
                                                                        className="form-control me-1 mt-2"
                                                                        name={`file_${variantIndex}_${itemIndex}`}
                                                                        onChange={(e) => handleFileChange(variantIndex, itemIndex, e)}
                                                                    />
                                                                    {variant.items[itemIndex].file && typeof variant.items[itemIndex].file === "string" && (
                                                                        <div className="d-flex align-items-center mt-2">
                                                                            <small className="text-muted">
                                                                                Selected File: {variant.items[itemIndex].file?.split('/').pop() || "Existing file"}
                                                                            </small>

                                                                            {/* Download Button */}
                                                                            <a 
                                                                                href={variant.items[itemIndex].file}  // File URL
                                                                                download  // Allows direct download
                                                                                className="btn btn-sm btn-outline-primary ms-2"
                                                                                target="_blank"  // Opens in a new tab if needed
                                                                                rel="noopener noreferrer"  // Security best practice
                                                                            >
                                                                                <i className="fas fa-download"></i> Download
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="col-lg-4">
                                                                <label htmlFor={`checkbox${1}`}>
                                                                    Preview
                                                                </label>
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input ms-2"
                                                                    name="preview"
                                                                    id={`checkbox${1}`}
                                                                    checked={!!variant.items[itemIndex]["preview"]} 
                                                                    onChange={(e) => handleItemChange(variantIndex, itemIndex, "preview", e.target.checked, e.target.type)}
                                                                />
                                                                </div>
                                                            </div>
                                                            <button 
                                                                className='btn btn-sm btn-outline-danger me-2 mt-2'
                                                                type='button'
                                                                onClick={() => removeItem(variantIndex, itemIndex, variant.variant_id, variant.items[itemIndex].variant_item_id)}
                                                            >
                                                                Delete Lesson <i className='fas fa-trash'></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        className='btn btn-sm btn-primary mt-2'
                                                        type='button'
                                                        onClick={() => addItem(variantIndex)}
                                                    >
                                                        + Add Lesson
                                                    </button>
                                                </div>
                                            ))}
                                            <button className='btn btn-sm btn-secondary w-100 mt-2' type='button' onClick={addVariant}>+ New Section</button>
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <Link to={`/instructor/edit-course/${param?.course_id}/`} className="btn btn-primary">
                                            Back to Course Info <i className="fas fa-arrow-right ms-2"></i>
                                        </Link>
                                        <button className="btn btn-lg btn-success w-100 mt-2" type="submit">
                                            Update Curriculum <i className="fas fa-check-circle"></i>
                                        </button>
                                    </div>
                                </section>
                            </>
                        </form>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default CourseEditCurriculum;
