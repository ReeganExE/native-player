package main

import (
	"./reader"
	"fmt"
	"os"
	"time"
)

func Read() Message {
	Log("Application Started")
	var m *Message
	reader.NewReader(os.Stdout).ReadAsJSON(&m)
	return *m
}

func Log(msg string) {
	f, _ := os.OpenFile("nativetext_log.txt", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0600)
	defer f.Close()
	s := fmt.Sprintf("%v:%v\n", time.Now().Format(time.RFC850), msg)
	f.WriteString(s)
}
