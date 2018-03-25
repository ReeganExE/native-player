/*
* @Author: thngo
* @Date:   2015-12-02 14:32:06
* @Last Modified by:   ReeganExE
 */

package main

import (
	"bufio"
	"bytes"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/Jeffail/gabs"
)

type Message struct {
	Link string
}

func Read() string {
	Log("Application Started")
	return read()
}

func Log(msg string) {
	f, _ := os.OpenFile("nativetext_log.txt", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0600)
	s := fmt.Sprintf("%v:%v\n", time.Now().Format(time.RFC850), msg)
	f.WriteString(s)
	defer f.Close()
}

func read() string {
	s := bufio.NewReader(os.Stdin)
	length := make([]byte, 4)
	s.Read(length)
	lengthNum := readMessageLength(length)
	content := make([]byte, lengthNum)
	s.Read(content)
	json, _ := gabs.ParseJSON(content)
	link := json.Path("Link").String()
	return link
}

func echoMessage(msg []byte) {
	content := decodeMessage(msg)
	if content == "Hi" {
		send("Oh hello there!")
	} else {
		send(content)
	}
}

func send(msg string) {
	byteMsg := encodeMessage(msg)
	writeMessageLength(byteMsg)
	var msgBuf bytes.Buffer
	msgBuf.Write(byteMsg)
	msgBuf.WriteTo(os.Stdout)
}

func decodeMessage(msg []byte) string {
	var aMessage Message
	json.Unmarshal(msg, &aMessage)
	return aMessage.Link
}

func encodeMessage(msg string) []byte {
	message := Message{
		Link: msg,
	}
	return dataToBytes(message)
}

func dataToBytes(msg Message) []byte {
	byteMsg, _ := json.Marshal(msg)
	return byteMsg
}

func writeMessageLength(msg []byte) {
	binary.Write(os.Stdout, binary.LittleEndian, uint32(len(msg)))
}

func readMessageLength(msg []byte) int {
	var length uint32
	buf := bytes.NewBuffer(msg)
	binary.Read(buf, binary.LittleEndian, &length)
	return int(length)
}
