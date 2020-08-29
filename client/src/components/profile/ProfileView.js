import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../webparts/Spinner";
import { getProfile } from "../../actions/profile";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";

const ProfileView = ({
  getProfile,
  profile: { profile, loading, experience },
  auth,
  match,
}) => {
  useEffect(() => {
    getProfile(match.params.id);
  }, [getProfile, match]);

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div>
            <Link to="/profiles">
              <span>
                <i class="fas fa-arrow-circle-left fa-2x"></i>
              </span>
            </Link>
            {auth.isAuthenticated &&
              auth.loading === false &&
              auth.user._id === match.params.id && (
                <Link to="/manage-profile" className="btn btn-dark">
                  Edit Profile
                </Link>
              )}
          </div>
        </Fragment>
      )}
      <div class="profile-grid my-1">
        {profile && (
          <Fragment>
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div class="profile-exp bg-white p-2">
              <h2 class="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((exp) => (
                    <ProfileExperience
                      key={exp._id}
                      experience={exp}
                    ></ProfileExperience>
                  ))}
                </Fragment>
              ) : (
                <h5>
                  <em>experiences aren't yet included</em>
                </h5>
              )}
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

ProfileView.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfile })(ProfileView);
