import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function InvitePage() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAndJoinRoom = async () => {
            if (!roomId) return;

            const token = localStorage.getItem("token");
            if (!token) {
                navigate(`/login?redirect=/invite/${roomId}`);
                return;
            }

            try {
                const response = await axios.post(
                    `http://localhost:8080/api/rooms/${roomId}/members`,
                    {}, // POST body가 없다면 빈 객체로
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status === 200) {
                    // 성공적으로 멤버 추가됨
                    navigate(`/rooms/${roomId}`);
                } else {
                    throw new Error("방 참여에 실패했습니다.");
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    localStorage.removeItem("token");
                    navigate(`/login?redirect=/invite/${roomId}`);
                } else {
                    alert("방 참여에 실패했습니다.");
                    console.error(error);
                }
            }
        };

        checkAndJoinRoom();
    }, [roomId, navigate]);

    return <div>초대 링크 확인 중입니다…</div>;
}

export default InvitePage;
