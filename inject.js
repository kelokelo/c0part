var inject_proxy ={};
var cache = [];

inject_proxy.parseMessage = MessageFactory.parseMessage;
MessageFactory.parseMessage = function(event){
  var msg = inject_proxy.parseMessage(event);
  console.info(msg);

  if( msg.msgType == "SOLD"){
    msg.a_name = $(".lotInfoDesc div:first").text().trim();
    cache.push(msg);
  }

  // cache.length > 3 ||
  if(msg.msgType == "ENDAUC") {window.auction_end_result = cache};
  return msg;
}
