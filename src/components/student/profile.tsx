import {useEffect, useState} from "react";
import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";
import {useNavigate} from "react-router-dom";

interface StudentInfo {
    name: null | string;
    last_name: null | string;
    mobile: null | string;
    email: null | string;
}

export const ProfileSection: React.FC = () => {
    const [saved, setSaved] = useState(false);
    const [openOtp, setOpenOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [isEditingMobile, setIsEditingMobile] = useState(false);
    const navigate = useNavigate();
    const [err, setErr] = useState('');
    const [message, setMessage] = useState('')
    const [studentInfo, setStudentInfo] = useState<StudentInfo>({
        name: '',
        last_name: '',
        mobile: '',
        email: ''
    })
    const getInfo = () => {
        Axios.get('http://localhost:8000/student/info', {withCredentials: true})
            .then((res) => {
                setStudentInfo(res.data.student_info);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getInfo();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }

    const saveStudentInfo = () => {
        console.log(studentInfo)
        Axios.post('http://localhost:8000/student/info', studentInfo, {withCredentials: true})
            .then((res) => {
                const data = res.data.new;
                setOpenOtp(data);
                if (!data) {
                    getInfo();
                }

            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return saveStudentInfo();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }
    const verify = () => {
        const data = {'mobile': studentInfo.mobile, 'code': otp};
        Axios.post('http://localhost:8000/student/verify', data, {withCredentials: true})
            .then((res) => {
                getInfo();
                setOtp('');
                setOpenOtp(false);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return verify();
                    }
                } else if (err.response.status === 400) {
                    setErr("کد شما با کد ارسالی مطابقت ندارد!")
                }
                revoke()
                navigate('/auth');
            })
    }
    useEffect(() => {
        getInfo()
    }, []);
    return (
        <>
            <div className="std-sec-header">
                <div className="std-sec-header__left">
                    <div className="std-sec-title">پروفایل من</div>
                    <div className="std-sec-sub">مشخصات و اطلاعات حساب</div>
                </div>
            </div>
            <div className="std-card">
                <div className="std-card__header">
                    <div className="std-card__title">👤 اطلاعات شخصی</div>
                </div>
                <div className="std-card__body">
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14}}>
                        <div><label className="std-form-label">نام *</label><input className="std-input"
                                                                                   value={studentInfo.name ?? ''}
                                                                                   onChange={(e) => {
                                                                                       setStudentInfo(prev => ({
                                                                                           ...prev,
                                                                                           name: e.target.value
                                                                                       }))
                                                                                   }}/></div>
                        <div><label className="std-form-label">نام خانوادگی *</label><input className="std-input"
                                                                                            value={studentInfo.last_name ?? ''}
                                                                                            onChange={(e) => {
                                                                                                setStudentInfo(prev => ({
                                                                                                    ...prev,
                                                                                                    last_name: e.target.value
                                                                                                }))
                                                                                            }}/></div>
                    </div>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14}}>
                        <div><label className="tch-form-label">شماره موبایل *</label>

                            <input
                                className="tch-input"
                                placeholder="۰۹۱۲-XXX-XXXX"
                                value={studentInfo.mobile ?? ''}
                                disabled={!isEditingMobile}
                                onChange={(e) =>
                                    setStudentInfo(prev => ({
                                        ...prev,
                                        mobile: e.target.value
                                    }))}
                            />
                            <input
                                type="checkbox"
                                checked={isEditingMobile}
                                onChange={(e) => setIsEditingMobile(e.target.checked)}
                            />
                        </div>
                        <div><label className="std-form-label">ایمیل</label><input className="std-input"
                                                                                   value={studentInfo.email ?? ''}
                                                                                   onChange={(e) => {
                                                                                       setStudentInfo(prev => ({
                                                                                           ...prev,
                                                                                           email: e.target.value
                                                                                       }))
                                                                                   }}
                                                                                   placeholder="test@gmail.com"/></div>
                    </div>
                    {openOtp && (
                        <div className="tch-form-row">
                            <div><label className="tch-form-label">کد ارسال:</label><input
                                className="tch-input" placeholder="*****"
                                value={otp} onChange={(e) => {
                                setOtp(e.target.value)
                            }}/></div>
                        </div>
                    )}
                    {openOtp && (
                        <button className="tch-btn tch-btn--primary"
                            onClick={() => {
                                verify()
                            }}
                        >
                            تایید
                        </button>
                    )}
                    <div style={{textAlign: "left"}}>
                        <button className="std-btn std-btn--primary" onClick={() => {
                            saveStudentInfo()
                            setSaved(true);
                            setTimeout(() => setSaved(false), 2000)
                        }}>
                            {saved ? "✓ ذخیره شد" : "💾 ذخیره"}
                        </button>
                    </div>
                    {err && (
                        <p className="phone-error" style={{
                            color: 'tomato',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            padding: '0 30px 0 0'
                        }}>
                            {err}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};
