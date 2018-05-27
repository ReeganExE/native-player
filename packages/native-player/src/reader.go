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
	"fmt"
	"os"
	"time"

)

func Read() Message {
	Log("Application Started")
	return read()
}

func Log(msg string) {
	f, _ := os.OpenFile("nativetext_log.txt", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0600)
	s := fmt.Sprintf("%v:%v\n", time.Now().Format(time.RFC850), msg)
	f.WriteString(s)
	defer f.Close()
}

func read() Message {
	s := bufio.NewReader(os.Stdin)
	length := make([]byte, 4)
	s.Read(length)
	lengthNum := readMessageLength(length)
	content := make([]byte, lengthNum)
	s.Read(content)

	message, _ := ParseMessage(content)
	return message
}

func echoMessage(msg * Message) {
	content, _ := msg.Marshal()
	send(content)
}

func send(content []byte) {
	writeMessageLength(content)
	var msgBuf bytes.Buffer
	msgBuf.Write(content)
	msgBuf.WriteTo(os.Stdout)
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
