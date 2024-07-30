// import React from 'react';
import axios from '../../lib';
import { Button } from '../../components/button';
import TextArea from '../../components/forms/textarea';
import './replay.scss';
import { useParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../redux/hooks';
import { API_ROOT } from '../../constants';

const Replay = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { slug } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  // const [image, setImage] = useState(null);

  const getTicketDetails = async () => {
    try {
      const response = await axios.get(`/supports/${slug}`);
      if (response.status === 200) {
        setText('');
        setMessages(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/supports`, {
        details: text,
        user_id: user?.user?.id,
        parent_text_id: slug,
        user_name: user?.user.name,
        text_type: "replay"
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        setText('');
        getTicketDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTicketDetails();
  }, [slug]);

  return (
    <div>
      <div className="replay-area">
        {/* User Message */}
        {messages.map((message, index) => (
          <div
            className={`${
              message.user_id === user?.user.id ? 'right' : 'left'
            }`}
            key={index}
          >
            {message.image && (
              <img
                src={`${API_ROOT}/images/support/${message.image}`}
                alt="replay"
              />
            )}

            <p className="text">{message.details}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <TextArea
          placeholder="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        {/*  <FileInput
          onChange={(e: any) =>
            e.target.files[0] ? setImage(e.target.files[0]) : setImage(null)
          }
        /> */}
        <Button type="submit">Replay</Button>
      </form>
    </div>
  );
};

export default Replay;
