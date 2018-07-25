const myId = (new MediaStream).id;
console.log(`myId:${myId}`);
function appendVideo(stream) {
    const video = document.createElement('video');
    video.srcObject = stream;
    document.body.appendChild(video);
    video.play();
}
chrome.runtime.sendMessage('eiceogpklagmibnoccdincfglccflknk', { cap: true }, async streamId => {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId
                }
            }
        });
        appendVideo(stream);
    } catch (e) {
        console.error(e);
        return;
    }
    console.log(`streamId:${stream.id}`);
    const peer = new Peer(myId, {
        key: '4a7fa99d-23d3-48e8-9a07-d86c12446718' // 1時間映像のみ送受信 (2人接続して、２人目が１人目の映像が表示されていない状態) (スクリーンシェア)
    });
    peer.on('open', id => {
        myIdDisp.textContent = id;
        const room = peer.joinRoom('hoge_fuga_piyo_sfu', { mode: 'sfu', stream });
        room.on('stream', stream => {
            console.log(`room on stream peerId:${stream.peerId}`);
            appendVideo(stream);
        });
    });
});
