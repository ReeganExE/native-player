package main

import (
	"bytes"
	"encoding/binary"
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
	// url, _ := ioutil.ReadAll(os.Stdin)
	res := gabs.New()
	url := Read()
	Log(url)
	res.Set(url, "link")
	// url := "https://ninhdeptrai.com/Den-bao-gio.mp3"
	// fmt.Println(string(url) + " <---------------------")
	dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	conf, err := goconfig.LoadConfigFile(filepath.Join(dir, "./conf.ini"))
	if err != nil {
		panic(err)
	}

	proc, _ := conf.GetValue("", "proc")

	// fmt.Println(proc)

	if proc == "" {
		panic("Empty luancher")
	}

	res.Set(proc, "proccess")

	cmd := exec.Command(proc, string(url))
	err = cmd.Start()
	if err != nil {
		panic("Cannot start")
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
