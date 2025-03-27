import React from 'react';
import FriendButton from './FriendButton';
import RankingButton from './RankingButton';
import '/src/styles/GroupButtons.css';

class GroupButtons extends React.Component {

    render() {
        const { className, onClickFriends, onClickRanking } = this.props;

        return (
            <>
                <div className={'gb_container' + ' ' + className}>
                    <FriendButton onClick={onClickFriends} />
                    <RankingButton onClick={onClickRanking} />
                </div>
            </>
        );
    }
}

export default GroupButtons;