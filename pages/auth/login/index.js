import axios from "axios";
import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { useRecoilState } from "recoil";
import { authUserAtom } from "@src/recoil/recoil";

import styles from "@src/styles/register.module.scss";

import { isInputEmpty } from "@src/utils/inputValidation";

import { RiAlertFill } from "react-icons/ri";

const Login = () => {
  const router = useRouter();

  const [requestPostData, setRequestPostData] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const [showBtn, setShowBtn] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formDataError, setFormDataError] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [user, setUser] = useRecoilState(authUserAtom);

  const uploadDetails = () => {
    if (validateForm()) {
      return;
    }

    logIn();
  };

  const validateForm = () => {
    let hasError = false;

    let tempError = {
      email: "",
      password: "",
    };

    tempError.email = isInputEmpty(formData.email);
    if (tempError.email !== "") {
      hasError = true;
      setShowBtn(false);
    }

    tempError.password = isInputEmpty(formData.password);
    if (tempError.password !== "") {
      hasError = true;
      setShowBtn(false);
    }

    setFormDataError({
      ...tempError,
    });

    return hasError;
  };

  const logIn = async () => {
    setRequestPostData({
      loading: true,
      success: "",
      error: "",
    });

    try {
      const res = await axios.post(
        `/api/auth/login`,
        { ...formData },
        {
          withCredentials: true,
        }
      );
      setUser({
        id: res.data.data._id,
        name: res.data.data.name,
        email: res.data.data.email,
        logoUrl: res.data.data.logoUrl,
        isLoggedIn: "true",
      });

      setRequestPostData({
        loading: false,
        success: "Succesfully logged in",
        error: "",
      });

      router.push("/");
    } catch (error) {
      console.log("error: ", error);
      if (error.response) {
        setRequestPostData({
          loading: false,
          success: "",
          error: error.response.data.message,
        });
      } else {
        setRequestPostData({
          loading: false,
          success: "",
          error: "Something went wrong",
        });
      }
    }
  };

  const logInWithDefaultUser = async () => {
    setRequestPostData({
      loading: true,
      success: "",
      error: "",
    });

    try {
      const res = await axios.post(
        `/api/auth/login`,
        {
          name: "Default User",
          email: "Default@gmail.com",
          password: "Dhar@123",
        },
        {
          withCredentials: true,
        }
      );
      setUser({
        id: res.data.data._id,
        name: res.data.data.name,
        email: res.data.data.email,
        logoUrl: res.data.data.logoUrl,
        isLoggedIn: "true",
      });

      setRequestPostData({
        loading: false,
        success: "Succesfully logged in",
        error: "",
      });

      router.push("/");
    } catch (error) {
      console.log("error: ", error);
      if (error.response) {
        setRequestPostData({
          loading: false,
          success: "",
          error: error.response.data.message,
        });
      } else {
        setRequestPostData({
          loading: false,
          success: "",
          error: "Something went wrong",
        });
      }
    }
  };

  return (
    <div className={styles.s}>
      <div className={styles.s__registerContainer}>
        <h2 className={styles.s__title}>Log in to your account</h2>
        <h3 className={styles.s__subTitle}>log in to chat with the world.</h3>

        <div className={styles.s__inputContainer}>
          <label>Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(val) => {
              setShowBtn(true);
              setFormData({
                ...formData,
                email: val.target.value,
              });
            }}
          />
          {formDataError.email !== "" && (
            <span className={styles.errorMessage}>
              Please Enter Valid Email
            </span>
          )}
        </div>
        <div className={styles.s__inputContainer}>
          <label>Password</label>
          <input
            type="text"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(val) => {
              setShowBtn(true);
              setFormData({
                ...formData,
                password: val.target.value,
              });
            }}
          />
          {formDataError.password !== "" && (
            <span className={styles.errorMessage}>
              Please Enter Valid password
            </span>
          )}
        </div>
        {requestPostData.loading && (
          <div className="text-center pt-4">
            <div className="spinner-border text-primary" role="status" />
          </div>
        )}
        {!requestPostData.loading && requestPostData.error !== "" && (
          <div className={`${styles.errorMessageContainer}`}>
            <div className={`${styles.errorMessageContainer__errorMessage}`}>
              <RiAlertFill className="me-2" />
              {requestPostData.error}
            </div>
          </div>
        )}

        {!requestPostData.loading && requestPostData.success !== "" && (
          <div className="text-center pt-2">
            <div className="text-success">{requestPostData.success}</div>
          </div>
        )}
        <div className={styles.s__btnContainer}>
          <button
            className={`${
              formData.email !== "" && formData.password !== "" && showBtn
                ? styles.s__activeBtn
                : styles.s__notActiveBtn
            }`}
            onClick={() => {
              uploadDetails();
            }}
          >
            {" "}
            Log in
          </button>
          <button
            className={`${styles.s__defaultUserBtn}`}
            onClick={() => {
              logInWithDefaultUser();
            }}
          >
            Default User
          </button>
        </div>
        <span className={`${styles.s__alreadyHaveAnAccTxt}`}>
          New to we-chat? <Link href="/auth/register">Sign Up</Link>
        </span>
      </div>

      <div className={styles.s2__backgroundImgContainer}>
        <img
          className={styles.s2__backgroundImg}
          src="/img/register/backgroundImg.png"
          alt=""
          layout="fill"
        />{" "}
        <h5 className={styles.s2__backgroundImgContainer__title}>
          Get started with account
        </h5>
        <h6 className={styles.s2__backgroundImgContainer__subTitle}>
          Communication has never been this
          <br /> easy, you re just one click far to use this.
          <br />
          log in if already registered.
        </h6>
        <Link href="/auth/register">
          <div className={styles.s2__backgroundImgContainer__logInTxt}>
            Sign up to your account
            <div className={styles.s2__underline}></div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req }) {
  const tokens = req?.headers?.cookie?.split("=");
  const token = (tokens && tokens[1]) || "";

  if (token !== "") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default Login;
