import { useState } from "react";
import "./Profile.css";

export default function Profile() {

    const [showModal, setShowModal] = useState(false);

    const [user, setUser] = useState({
        name: "Trần Cao Nguyên",
        avatar: "https://i.pravatar.cc/300",
        location: "Vũng Tàu",
        joinYear: "2025",

        job: "",
        language: "Tiếng Việt",
        about: "",
        verified: true
    });


    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };


    return (

        <div className="profile-page">


            {/* HEADER */}

            <div className="profile-top">

                <div>

                    <span className="sub-title">
                        Khu vực tài khoản
                    </span>

                    <h1>
                        Giới thiệu bản thân
                    </h1>

                    <p>
                        Cập nhật hồ sơ để khách và host hiểu bạn hơn.
                    </p>

                </div>


                <button
                    className="edit-btn"
                    onClick={() => setShowModal(true)}
                >

                    ✏ Chỉnh sửa

                </button>

            </div>




            {/* CONTENT */}

            <div className="profile-content">


                {/* LEFT */}


                <div className="user-card">


                    <div className="avatar-box">


                        <img
                            src={user.avatar}
                            alt=""
                        />


                        <div className="camera-btn">

                            📷

                        </div>

                    </div>



                    <h2>

                        {user.name}

                    </h2>



                    <p>

                        📍 {user.location}

                    </p>



                    <p>

                        Tham gia từ {user.joinYear}

                    </p>




                    <button
                        className="profile-btn"
                        onClick={() => setShowModal(true)}
                    >

                        Chỉnh sửa hồ sơ

                    </button>



                </div>





                {/* RIGHT */}



                <div className="right-section">



                    <div className="info-card">



                        <div className="item">

                            <h3>💼 Công việc</h3>

                            <span>

                                {user.job || "Chưa cập nhật"}

                            </span>

                        </div>





                        <div className="item">

                            <h3>📍 Nơi sống</h3>

                            <span>

                                {user.location}

                            </span>

                        </div>





                        <div className="item">

                            <h3>🌏 Ngôn ngữ</h3>

                            <span>

                                {user.language}

                            </span>

                        </div>





                        <div className="item">

                            <h3>🛡 Xác minh</h3>

                            <span>

                                {

                                    user.verified

                                        ? "Đã xác minh"

                                        : "Chưa xác minh"

                                }

                            </span>

                        </div>


                    </div>






                    <div className="about-box">


                        <h2>

                            Về tôi

                        </h2>



                        <p>

                            {

                                user.about ||

                                "Chưa cập nhật thông tin giới thiệu."

                            }

                        </p>


                    </div>




                </div>



            </div>





            {/* MODAL */}



            {

                showModal && (

                    <div className="modal-bg">


                        <div className="modal">


                            <h2>

                                Chỉnh sửa hồ sơ

                            </h2>





                            <input

                                name="name"

                                value={user.name}

                                onChange={handleChange}

                                placeholder="Họ tên"

                            />





                            <input

                                name="location"

                                value={user.location}

                                onChange={handleChange}

                                placeholder="Nơi sống"

                            />






                            <input

                                name="job"

                                value={user.job}

                                onChange={handleChange}

                                placeholder="Công việc"

                            />






                            <input

                                name="language"

                                value={user.language}

                                onChange={handleChange}

                                placeholder="Ngôn ngữ"

                            />






                            <textarea


                                name="about"

                                value={user.about}

                                onChange={handleChange}

                                placeholder="Giới thiệu bản thân"


                            />







                            <div className="btn-group">


                                <button

                                    onClick={() => setShowModal(false)}

                                >

                                    Huỷ


                                </button>





                                <button

                                    className="save"

                                    onClick={() => setShowModal(false)}

                                >

                                    Lưu


                                </button>




                            </div>



                        </div>


                    </div>

                )

            }


        </div>

    );

}