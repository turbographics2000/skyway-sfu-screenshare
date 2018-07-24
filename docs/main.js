const myId = (new MediaStream).id;
console.log(`myId:${myId}`);
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
    } catch (e) {
        console.error(e);
        return;
    }
    console.log(`streamId:${stream.id}`);
    localView.srcObject = stream;
    const peer = new Peer(myId, {
        key: '01099bd8-1083-4c33-ba9b-564a1377e901'
    });
    peer.on('open', id => {
        myIdDisp.textContent = id;
        const room = peer.joinRoom('hoge_fuga_piyo', { mode: 'sfu', stream });
        room.on('stream', stream => {
            console.log(`room on stream peerId:${stream.peerId}`);
            remoteView.srcObject = stream;
        });
    });
});
