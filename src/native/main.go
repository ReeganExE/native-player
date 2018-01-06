//go:generate goversioninfo -icon=icon.ico

package main

import (
	"bytes"
	"encoding/binary"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/Jeffail/gabs"

	"./chrome"

	"github.com/Unknwon/goconfig"
)

func main() {
	if len(os.Args) > 1 && os.Args[1] == "install" {
		install()
		return
	}

	defer replyWithError()

	res := gabs.New()
	url := Read()
	Log(url)
	res.Set(url, "link")

	dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	confini := filepath.Join(dir, "./conf.ini")

	// Check and create conf.ini file
	if !exists(confini) {
		d1 := []byte("proc=C:\\Program Files\\MPC-HC\\mpc-hc64.exe")
		ioutil.WriteFile(confini, d1, 0644)
	}

	conf, err := goconfig.LoadConfigFile(confini)
	if err != nil {
		panic(err.Error())
	}

	proc, _ := conf.GetValue("", "proc")

	if proc == "" {
		panic("Empty luancher")
	}

	res.Set(proc, "proccess")

	cmd := exec.Command(proc, string(url))
	err = cmd.Start()
	if err != nil {
		panic("Cannot start: " + err.Error())
	}

	cmd.Process.Release()
	respond(res)
}

func install() {
	defer dump()
	exe, _ := os.Executable()
	chrome.Install(exe)
}

func dump() {
	if r := recover(); r != nil {
		log.Fatal(r)
	}
}

func replyWithError() {
	if r := recover(); r != nil {
		err := r.(string)
		res := gabs.New()
		res.Set(err, "error")
		respond(res)
	}
}

func respond(json *gabs.Container) {
	j := json.String()
	Log(j)
	str := []byte(j)
	binary.Write(os.Stdout, binary.LittleEndian, uint32(len(str)))
	sendBytes(str)
}

func sendBytes(byteMsg []byte) {
	var msgBuf bytes.Buffer
	msgBuf.Write(byteMsg)
	msgBuf.WriteTo(os.Stdout)
}
