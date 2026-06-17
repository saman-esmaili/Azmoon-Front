import {useEffect, useState} from "react";
import Axios from "axios";
import {CheckAuth} from "../check_auth";
import DeleteModal from "../components/teacher/delete_class";

interface Comment {
    comment_id: number;
    comment: string;
    rating: number;
    plan_name: string;
    created_at: string;
}

export const PlanComments = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [openDelete, setOpenDelete] = useState(false)
    const [text, setText] = useState('');
    const getComments = () => {
        Axios.get(
            'http://localhost:8000/comment/teacher',
            {withCredentials: true}
        ).then(res => {
            setComments(res.data.comment);
        }).catch(async (err) => {
            if (err.response.status === 401) {
                const is_successful = await CheckAuth();
                if (is_successful) {
                    return getComments();
                }
            }
            // revoke()
            // navigate('/auth');
        })
    };
    const [commentId, setCommentId] = useState(-1)
    const remove = (comment_id: number, text: string) => {
        setText(text);
        setCommentId(comment_id)
        setOpenDelete(true);
    }
    useEffect(() => {
        getComments();
    }, []);

    const deleteComment = async (id: number) => {
        Axios.delete(`https://localhost:8000/comment/${id}`, {withCredentials: true})
            .then((res) => {
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return deleteComment(id);
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    };

    const updateComment = async (id: number) => {
        await Axios.put(
            `http://localhost:8000/admin/plan-comments/${id}`,
            {comment: editText},
            {withCredentials: true}
        );

        setEditingId(null);
        getComments();
    };
    return (
        <div className="comments-page">
            <div className="tch-sec-header">
                <div className="tch-sec-header__left">
                    <div className="tch-sec-title">نظرات شما</div>
                </div>
            </div>

            {comments.length === 0 ? (
                <div className="comment-card">
                    <p>هنوز نظری ثبت نشده است.</p>
                </div>
            ) : (
                comments.map((item) => (
                    <div className="comment-card" key={item.comment_id}>
                        <div className="comment-card__header">
                            <div>
                                <strong>{item.plan_name}</strong>

                                <div className="comment-card__date">
                                    {item.created_at}
                                </div>
                            </div>

                            <div className="comment-card__stars">
                                {[...Array(item.rating)].map((_, i) => (
                                    <span key={i}>⭐</span>
                                ))}
                            </div>
                        </div>

                        {editingId === item.comment_id ? (
                            <>
                            <textarea
                                value={editText}
                                onChange={(e) =>
                                    setEditText(e.target.value)
                                }
                                placeholder="متن نظر..."
                            />

                                <div className="comment-card__actions">
                                    <button
                                        className="comment-btn comment-btn--save"
                                        onClick={() =>
                                            updateComment(item.comment_id)
                                        }
                                    >
                                        ذخیره
                                    </button>

                                    <button
                                        className="comment-btn comment-btn--cancel"
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditText('');
                                        }}
                                    >
                                        لغو
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>{item.comment}</p>

                                <div className="comment-card__actions">
                                    <button
                                        className="comment-btn comment-btn--edit"
                                        onClick={() => {
                                            setEditingId(item.comment_id);
                                            setEditText(item.comment);
                                        }}
                                    >
                                        ✏️ ویرایش
                                    </button>

                                    <button
                                        className="comment-btn comment-btn--delete"
                                        onClick={() =>
                                            remove(item.comment_id, item.comment)
                                        }
                                    >
                                        🗑 حذف
                                    </button>
                                </div>
                            </>
                        )}
                        <DeleteModal
                            isOpen={openDelete}
                            ItemName={text}
                            name='نظر'
                            onCancel={() => setOpenDelete(false)}
                            onConfirm={() => {
                                if (commentId !== -1) {
                                    deleteComment(commentId)
                                }
                                setOpenDelete(false)
                            }}
                        />
                    </div>
                ))
            )}
        </div>
    );
};