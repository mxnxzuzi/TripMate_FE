import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/MyCoursePage.css";

const MyCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ 라우터 이동용

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("로그인이 필요합니다.");
          return;
        }

        const response = await axios.get("http://localhost:8080/rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rooms = response.data.result.map((room) => {
          return {
            id: room.roomId, // ✅ roomId 저장
            title: room.name || room.plan?.title || "제목 없음",
            startDate: formatDate(room.plan?.startDate),
            endDate: formatDate(room.plan?.endDate),
          };
        });

        setCourses(rooms);
      } catch (err) {
        console.error("방 목록을 불러오지 못했습니다:", err);
        setError("방 목록을 불러오지 못했습니다.");
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="mycourse-wrapper">
      <header className="mycourse-header">
      </header>

      {error && <p className="error-message">{error}</p>}

      <div className="course-list">
        {courses.length > 0 ? (
          courses.map((course, idx) => (
            <div
              className="course-item"
              key={idx}
              onClick={() => navigate(`/rooms/${course.id}`)} 
              style={{ cursor: "pointer" }} 
            >
              {course.title} ({course.startDate} ~ {course.endDate})
            </div>
          ))
        ) : (
          <p className="no-courses">등록된 코스가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyCoursePage;
