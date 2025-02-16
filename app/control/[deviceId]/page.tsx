'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

interface DeviceStatus {
  deviceMode?: string;
  deviceType?: string;
  remoteType?: string;
}

export default function DeviceControlPage() {
  const params = useParams();
  const { deviceId } = params as { deviceId: string };
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  //クエリ
  const searchParams = useSearchParams();
  const queryRemoteType = searchParams.get('remoteType') || '';
  //エアコン
  const [acTemp, setAcTemp] = useState(26);          // 温度
  const [acMode, setAcMode] = useState(1);           // 0/1(auto),2(cool),3(dry),4(fan),5(heat)
  const [acFan, setAcFan] = useState(1);            // 1(auto),2(low),3(medium),4(high)
  const [acPower, setAcPower] = useState('on');      // "on"/"off"

  // TV
  const [tvChannel, setTvChannel] = useState(1);

  useEffect(() => {
    if (!deviceId) return;
    const fetchStatus = async () => {
      try {
        const access = Cookies.get('access');
        const res = await axios.get<DeviceStatus>(`${baseURL}/api/control/${deviceId}`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        setStatus(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStatus();
  }, [deviceId]);

  const sendCommand = async (command: string, param?: string) => {
    try {
      const access = Cookies.get('access');
      await axios.post(`${baseURL}/api/control/${deviceId}/${command}/`, param ? { param } : {}, {
        headers: { Authorization: `Bearer ${access}` },
      });
      alert("Command sent");
    } catch (error) {
      console.error(error);
      alert("Failed to send command");
    }
  };

  const handleACSetAll = () => {
    // "26,1,3,on"
    const param = `${acTemp},${acMode},${acFan},${acPower}`;
    sendCommand('setAll', param);
  };

  // TV チャンネル変更
  const handleSetChannel = () => {
    const param = `${tvChannel}`;
    sendCommand('SetChannel', param);
  };
  if (!status) return <div>Loading...</div>;
  // deviceType が "Bot" 以外のとき remoteType は本来 undefined のことが多い
  // SwitchBotの status API は "remoteType" を返さない場合もあるため、
  // 一覧からクエリで来た "queryRemoteType" と合体して判断
  const effectiveRemoteType = status.remoteType || queryRemoteType;

  return (
    <div>
      <h1>Device Control: {deviceId}</h1>
      {status.deviceType === 'Bot' && (
        <div>
          {status.deviceMode === 'pressMode' ? (
            <button onClick={() => sendCommand('press')}>Press</button>
          ) : (
            <div>
              <button onClick={() => sendCommand('turnOn')}>Turn On</button>
              <button onClick={() => sendCommand('turnOff')}>Turn Off</button>
            </div>
          )}
        </div>
      )}
      {effectiveRemoteType === 'TV' && (
        <div style={{ marginTop: '1rem' }}>
          <h2>TV Remote</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => sendCommand('turnOn')}>Power On</button>
            <button onClick={() => sendCommand('turnOff')}>Power Off</button>
            <button onClick={() => sendCommand('volumeAdd')}>Volume +</button>
            <button onClick={() => sendCommand('volumeSub')}>Volume -</button>
            <button onClick={() => sendCommand('channelAdd')}>Channel +</button>
            <button onClick={() => sendCommand('channelSub')}>Channel -</button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label>Channel: </label>
            <input
              type="number"
              value={tvChannel}
              onChange={(e) => setTvChannel(Number(e.target.value))}
            />
            <button onClick={handleSetChannel}>Set Channel</button>
          </div>
        </div>
      )}
      {effectiveRemoteType === 'Air Conditioner' && (
        <div style={{ marginTop: '1rem' }}>
          <h2>Air Conditioner Remote</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '300px' }}>
            <label>
              Temperature:
              <input
                type="number"
                min={18}
                max={30}
                value={acTemp}
                onChange={(e) => setAcTemp(Number(e.target.value))}
              />
            </label>
            <label>
              Mode:
              <select value={acMode} onChange={(e) => setAcMode(Number(e.target.value))}>
                <option value={1}>Auto</option>
                <option value={2}>Cool</option>
                <option value={3}>Dry</option>
                <option value={4}>Fan</option>
                <option value={5}>Heat</option>
              </select>
            </label>
            <label>
              Fan Speed:
              <select value={acFan} onChange={(e) => setAcFan(Number(e.target.value))}>
                <option value={1}>Auto(1)</option>
                <option value={2}>Low(2)</option>
                <option value={3}>Medium(3)</option>
                <option value={4}>High(4)</option>
              </select>
            </label>
            <label>
              Power:
              <select value={acPower} onChange={(e) => setAcPower(e.target.value)}>
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </label>
            <button onClick={handleACSetAll}>SetAll</button>
          </div>
        </div>
      )}
      {!(status.deviceType === 'Bot' || effectiveRemoteType === 'TV' || effectiveRemoteType === 'Air Conditioner') && (
        <p>未実装</p>
      )}
    </div>
  );
}