import {useEffect, useState} from "react";
import {ProfileTab} from "./types";
import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";
import {useNavigate} from "react-router-dom";
import {C} from "../../styles/theme";

interface UserInfo {
    name: null | string;
    last_name: null | string;
    specialized_field: null | string;
    educational_qualification: null | string;
}

interface UserContact {
    email: null | string;
    mobile: null | string;
    school_name: null | string;
}

export const ProfileSection: React.FC = () => {
    const [tab, setTab] = useState<ProfileTab>("personal");
    const [openOtp, setOpenOtp] = useState(false)
    const [otp, setOtp] = useState('')
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [err, setErr] = useState('')
    const [userInfo, setUserInfo] = useState<UserInfo>({
        educational_qualification: '',
        last_name: '',
        name: '',
        specialized_field: ''
    })
    const [userContact, setUserContact] = useState<UserContact>({
        email: '',
        mobile: '',
        school_name: '',
    })
    const completion = 72;
    const [isEditingMobile, setIsEditingMobile] = useState(false);

    const get_teacher_info = () => {
        Axios.get('http://localhost:8000/teacher/profile', {withCredentials: true})
            .then((res) => {
                const data = res.data.teacher_info
                setUserInfo({
                    name: data.name,
                    last_name: data.last_name,
                    specialized_field: data.specialized_field,
                    educational_qualification: data.educational_qualification
                })
                setUserContact({
                    email: data.email,
                    mobile: data.mobile,
                    school_name: data.school_name
                })
            }).catch(async (err) => {
            if (err.response.status === 401) {
                const is_successful = await CheckAuth();
                if (is_successful) {
                    return get_teacher_info();
                }
            }
            revoke()
            navigate('/auth');
        })
    }

    useEffect(() => {
        get_teacher_info()
    }, [])

    const saveTeacherInfo = () => {
        Axios.post('http://localhost:8000/teacher/profile/add/personal', userInfo, {withCredentials: true})
            .then((res) => {
                get_teacher_info()
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return saveTeacherInfo();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }
    const saveTeacherContact = () => {
        Axios.post('http://localhost:8000/teacher/profile/add/contact', userContact, {withCredentials: true})
            .then((res) => {
                const data = res.data.new;
                setOpenOtp(data);
                if (!data) {
                    get_teacher_info();
                }

            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return saveTeacherInfo();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }
    const verify = () => {
        const data = {'mobile': userContact.mobile, 'code': otp};
        console.log(data)
        Axios.post('http://localhost:8000/teacher/profile/verify', data, {withCredentials: true})
            .then((res) => {
                get_teacher_info();
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

    return (
        <>
            <div className="tch-sec-header">
                <div className="tch-sec-header__left">
                    <div className="tch-sec-title">پروفایل من</div>
                    <div className="tch-sec-sub">مشخصات و اطلاعات حساب کاربری</div>
                </div>
            </div>

            <div className="profile-layout">
                {/* Side */}
                <div className="profile-side">
                    <div className="profile-side__hero">
                        <div className="profile-avatar">👨‍🏫</div>
                        <div className="profile-side__name">دکتر محمد رضایی</div>
                        <div className="profile-side__role">استاد ریاضی و فیزیک</div>
                    </div>
                    <div className="profile-complete">
                        <div className="profile-complete__labels">
                            <span>تکمیل پروفایل</span>
                            <span style={{color: "var(--primary)", fontWeight: 800}}>{completion}٪</span>
                        </div>
                        <div className="profile-complete__track">
                            <div className="profile-complete__fill" style={{width: `${completion}%`}}/>
                        </div>
                    </div>
                    <div className="profile-side__links">
                        {([
                            ["personal", "اطلاعات شخصی", "👤"],
                            ["contact", "اطلاعات تماس", "📞"],
                            // ["security","امنیت","🔒"],
                        ] as [ProfileTab, string, string][]).map(([key, label, icon]) => (
                            <button key={key} className={`profile-link ${tab === key ? "profile-link--active" : ""}`}
                                    onClick={() => setTab(key)}>
                                <span className="profile-link__icon">{icon}</span>{label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="profile-form">
                    <div className="profile-form__header">
                        <div>
                            <div className="profile-form__title">
                                {tab === "personal" ? "اطلاعات شخصی" : tab === "contact" ? "اطلاعات تماس" : "امنیت حساب"}
                            </div>
                            <div className="profile-form__sub">لطفاً اطلاعات صحیح وارد کنید</div>
                        </div>
                    </div>
                    <div className="profile-form__body">
                        {tab === "personal" && <>
                            <div className="profile-form__section-title">مشخصات هویتی</div>
                            <div className="tch-form-row">
                                <div><label className="tch-form-label">نام *</label><input className="tch-input"
                                                                                           value={userInfo.name ?? ''}
                                                                                           onChange={(e) => setUserInfo(prev => ({
                                                                                               ...prev,
                                                                                               name: e.target.value
                                                                                           }))}/></div>
                                <div><label className="tch-form-label">نام خانوادگی *</label><input
                                    className="tch-input" value={userInfo.last_name ?? ''} onChange={(e) => {
                                    setUserInfo(prev => ({
                                        ...prev,
                                        last_name: e.target.value
                                    }))
                                }}/></div>
                            </div>
                            <div className="tch-form-row">
                                <div><label className="tch-form-label">رشته تخصصی</label><select className="tch-select"
                                                                                                 onChange={(e) => {
                                                                                                     setUserInfo(prev => ({
                                                                                                         ...prev,
                                                                                                         specialized_field: e.target.value
                                                                                                     }))
                                                                                                 }}
                                                                                                 value={userInfo.specialized_field ?? ''}
                                                                                                 style={{width: "100%"}}>
                                    <option>هنر</option>
                                    <option>علوم تجربی</option>
                                    <option>علوم انسانی</option>
                                    <option>ریاضی فیزیک</option>
                                    <option>زبان های خارجی</option>
                                    <option>سایر</option>
                                </select></div>
                                <div><label className="tch-form-label">مدرک تحصیلی</label><select className="tch-select"
                                                                                                  onChange={(e) => {
                                                                                                      setUserInfo(prev => ({
                                                                                                          ...prev,
                                                                                                          educational_qualification: e.target.value
                                                                                                      }))
                                                                                                  }}
                                                                                                  value={userInfo.educational_qualification ?? ''}
                                                                                                  style={{width: "100%"}}>
                                    <option>دیپلم</option>
                                    <option>فوق دیپلم</option>
                                    <option>لیسانس</option>
                                    <option>فوق لیسانس</option>
                                    <option>دکترا</option>
                                </select></div>
                            </div>
                        </>}

                        {tab === "contact" && <>
                            <div className="profile-form__section-title">اطلاعات تماس</div>
                            <div className="tch-form-row">
                                <div><label className="tch-form-label">ایمیل *</label><input className="tch-input"
                                                                                             value={userContact.email ?? ''}
                                                                                             onChange={(e) => {
                                                                                                 setUserContact(prev => ({
                                                                                                     ...prev,
                                                                                                     email: e.target.value
                                                                                                 }))
                                                                                             }}/>
                                </div>
                                <div><label className="tch-form-label">شماره موبایل *</label>

                                    <input
                                        className="tch-input"
                                        placeholder="۰۹۱۲-XXX-XXXX"
                                        value={userContact.mobile ?? ''}
                                        disabled={!isEditingMobile}
                                        onChange={(e) =>
                                            setUserContact(prev => ({
                                                ...prev,
                                                mobile: e.target.value
                                            }))
                                        }
                                    />
                                    <input
                                        type="checkbox"
                                        checked={isEditingMobile}
                                        onChange={(e) => setIsEditingMobile(e.target.checked)}
                                    />
                                </div>
                            </div>
                            <div className="tch-form-row">
                                <div><label className="tch-form-label">نام محل کار / آموزشگاه</label><input
                                    className="tch-input" placeholder="دبیرستان ..."
                                    value={userContact.school_name ?? ''} onChange={(e) => {
                                    setUserContact(prev => ({
                                        ...prev,
                                        school_name: e.target.value
                                    }))
                                }}/></div>
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
                                        }}>
                                    تایید
                                </button>
                            )}

                        </>}

                        {/*{tab === "security" && <>*/}
                        {/*  <div className="profile-form__section-title">تغییر رمز عبور</div>*/}
                        {/*  <div className="tch-form-full"><label className="tch-form-label">رمز عبور فعلی</label><input className="tch-input" type="password" placeholder="••••••••" /></div>*/}
                        {/*  <div className="tch-form-row">*/}
                        {/*    <div><label className="tch-form-label">رمز جدید</label><input className="tch-input" type="password" placeholder="••••••••" /></div>*/}
                        {/*    <div><label className="tch-form-label">تکرار رمز جدید</label><input className="tch-input" type="password" placeholder="••••••••" /></div>*/}
                        {/*  </div>*/}
                        {/*  <div className="profile-form__section-title" style={{marginTop:20}}>احراز هویت دو مرحله‌ای</div>*/}
                        {/*  <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:"1px solid var(--adm-border)"}}>*/}
                        {/*    <input type="checkbox" id="twofa" />*/}
                        {/*    <label htmlFor="twofa" style={{color:"var(--adm-text)",fontSize:14,fontWeight:600,cursor:"pointer"}}>فعال‌سازی احراز هویت دو مرحله‌ای از طریق SMS</label>*/}
                        {/*  </div>*/}
                        {/*</>}*/}
                    </div>
                    <div className="profile-form__footer">
                        <button className="tch-btn tch-btn--ghost">انصراف</button>
                        <button className="tch-btn tch-btn--primary"
                                onClick={tab === 'personal' ? saveTeacherInfo : saveTeacherContact}>
                            {saved ? "✓ ذخیره شد!" : "💾 ذخیره تغییرات"}
                        </button>
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
                        {message && (
                            <p style={{
                                color: 'green',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                padding: '0 30px 0 0'
                            }}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
