import React, { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, delAcct } from "../../actions/profile";
import Nav from "./Nav";
import Experience from "./Experience";
import Spinner from "../webparts/Spinner";

const Dashboard = ({
  getCurrentProfile,
  delAcct,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  return profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" />
        Welcome {user && user.name}
      </p>
      {profile != null ? (
        <Fragment>
          <Nav />
          <Experience experience={profile.experience} />
        </Fragment>
      ) : (
        <Fragment>
          Ready to set up your profile?{" "}
          <Link to="/manage-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
      <div className="my-2">
        <button className="btn btn-danger" onClick={() => delAcct()}>
          <span>
            <i className="fas fa-user-times"></i> Delete Account
          </span>
        </button>
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  delAcct: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});
export default connect(mapStateToProps, { getCurrentProfile, delAcct })(
  Dashboard
);
