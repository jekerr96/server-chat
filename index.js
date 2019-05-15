let http = require('http').createServer().listen(3000);
let io = require('socket.io').listen(http);

let search = {};

io.on('connection', function (socket) {
    socket.on("disconnect", function(){
        delete search[socket.id];
    });

    socket.on("reconnect_socket", function(data){
        if(data.roomName != "")
            socket.join(data.roomName);
    });

   socket.on("find", function(data) {
      console.log(data);

        for (id in search) {
            if (((search[id].me.sex === data.find.sex && search[id].find.sex === data.me.sex) || (data.find.sex == "0" && search[id].find.sex === data.me.sex) || (search[id].find.sex == "0" && data.find.sex === search[id].me.sex) || (search[id].find.sex == "0" && data.find.sex == "0"))
            && ((search[id].me.yeards === data.find.yeards && search[id].find.yeards === data.me.yeards) || (data.find.yeards == "0" && search[id].find.yeards === data.me.yeards) || (search[id].find.yeards == "0" && data.find.yeards === search[id].me.yeards) || (search[id].find.yeards == "0" && data.find.yeards == "0"))) {
                let roomName = makeRoom();

                socket.join(roomName);
                search[id].socket.join(roomName);

                socket.emit("onFind", {
                    roomName: roomName,
                    name: search[id].me.name,
                    index: 1,
                });

                search[id].socket.emit("onFind", {
                    roomName: roomName,
                    name: data.me.name,
                    index: 0,
                });

                delete search[id];
                console.log("find");
                return;
            }
        }

      search[socket.id] = {
          me: data.me,
          find: data.find,
          socket: socket,
      };

   });

   socket.on("onMsg", function(data) {
       io.in(data.roomName).emit('onMsg', data);
   });

   socket.on("cancelSearch", function(data) {
      delete search[socket.id];
   });
});


function makeRoom() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


