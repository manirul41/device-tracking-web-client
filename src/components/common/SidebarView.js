import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import SidebarItem from './SidebarItem';
import hasUserTrackerRoleFromLS from "../../utils/hasUserTrackerRoleFromLS";

class SidebarView extends Component {
  render() {
    const { selected } = this.props;
    return (
      <div id="sidebar-wrapper" >
        <ul className="sidebar-nav">
          <li className="sidebar-brand">
            <Link to="#">
              <img src="../../../images/loginpage/logo.png" alt="PTS Logo" width="20%" />
                <span className="text-white pl-1"><b>Zoya Tracking System</b></span>
            </Link>
          </li>
          <SidebarItem 
            link="/"
            title="Dashboard" faIcon="fas fa-chart-bar" selected={selected}
          />
          {hasUserTrackerRoleFromLS() !== true && <SidebarItem
            link="/my-tracker"
            title="My Tracker" faIcon="fas fa-home" selected={selected} 
          />}

          {hasUserTrackerRoleFromLS() !== true && <SidebarItem
            link="/history" 
            title="History" faIcon="fas fa-history" selected={selected} 
          />}

          {hasUserTrackerRoleFromLS() !== true && <SidebarItem
            link="/payment-plan"
            title="Payments" faIcon="fas fa-money-bill-alt" selected={selected}
          />}

          {hasUserTrackerRoleFromLS() !== true && <SidebarItem
              link="/report"
              title="Report" faIcon="fas fa-chart-bar" selected={selected}
          />}
          
          {hasUserTrackerRoleFromLS() !== true && <SidebarItem
            link="/configure-tracker"
            title="Configure Tracker" faIcon="fas fa-cog" selected={selected}
          />}

          {hasUserTrackerRoleFromLS() !== true && <SidebarItem
              link="/health"
              title="Health" faIcon="fas fa-file-medical-alt" selected={selected}
          />}

          {hasUserTrackerRoleFromLS() !== true && <SidebarItem
              link="/sos-number"
              title="SOS Number" faIcon="fas fa-file-medical-alt" selected={selected}
          />}

          <SidebarItem
              link="/inbox"
              title="Ask Support" faIcon="fas fa-envelope" selected={selected}
          />

          <SidebarItem
              link="/help-center"
              title="Help Center" faIcon="fas fa-envelope" selected={selected}
          />

        </ul>
      </div>
    );
  }
}

export default SidebarView;
