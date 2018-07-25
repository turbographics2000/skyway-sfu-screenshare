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
                    chromeMediaSourceId: streamId,
                    minWidth: 1280,
                    minHeight: 720
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
        key: 'ded71f90-bbba-4a06-b134-e0e73562d500' // 1時間映像のみ送受信 (3人目接続しすぐに3人目を切断) (スクリーンシェア)
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
