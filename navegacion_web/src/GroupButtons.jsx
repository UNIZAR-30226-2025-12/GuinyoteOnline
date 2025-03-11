import React from 'react';
import FriendButton from './FriendButton';
import RankingButton from './RankingButton';
import SettingsButton from './SettingsButton';
import './GroupButtons.css';

class GroupButtons extends React.Component {

    render() {
        const { className, onClickFriends, onClickSettings, onClickRanking } = this.props;

        return (
            <>
                <div className={'gb_container' + ' ' + className}>
                    <FriendButton onClick={onClickFriends} />
                    <RankingButton onClick={onClickRanking} />
                    <SettingsButton onClick={onClickSettings} />
                </div>
            </>
        );
    }
}

export default GroupButtons;