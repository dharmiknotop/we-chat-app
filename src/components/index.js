import axios from 'axios';
import styles from './css/mainScreen.module.scss';
import { useRecoilState } from 'recoil';
import { useRecoilValue } from 'recoil';
import { authUserAtom, messageId, theOtherUser } from '../recoil/recoil';
import { collection, query, where, onSnapshot } from '@firebase/firestore';
import { db } from '../../firebaseConfig';
import UserList from './leftSection/UserList';
import ChatList from './rightSection/ChatList';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

const Index = () => {
  const messageEndRef = useRef();
  const router = useRouter();

  const { chatRoomId } = router.query;

  const user = useRecoilValue(authUserAtom);

  const messageRefId = useRecoilValue(messageId);

  const tempColRef = collection(db, 'chats');

  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    try {
      const res = await axios.post(
        `/api/messages/getMessages`,
        { chatRoomId },
        {
          withCredentials: true,
        }
      );

      setMessages(res.data.data);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(tempColRef, (snapshot) => {
      if (snapshot.size) {
        getMessages();
        if (!messageRefId) {
          messageEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      } else {
        console.log('no space');
      }
    });

    return () => {
      unsub();
    };
  }, [db, router, chatRoomId]);

  return (
    <div className={` ${styles.containerOuter}`}>
      <div className={` ${styles.container}`}>
        <div className={`${styles.s}`}>
          <UserList user={user} />
        </div>
        <div className={`${styles.s2}`}>
          <ChatList chats={messages} messageEndRef={messageEndRef} />
        </div>
      </div>
    </div>
  );
};

export default Index;
