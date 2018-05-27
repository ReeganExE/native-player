//go:generate goversioninfo -icon=icon.ico

package main

import (
	"bytes"
	"encoding/binary"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"

	"github.com/Jeffail/gabs"

	"io/ioutil"

	"./chrome"
)

func main() {
	if len(os.Args) > 1 && os.Args[1] == "install" {
		install()
		return
	}

	defer replyWithError()

	var nativeAppConfig NativeConfig

	res := gabs.New()
	url := Read()
	Log(url)
	res.Set(url, "link")

	dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	configFilePath := filepath.Join(dir, "./conf.json")

	// Check and create conf.ini file
	if !exists(configFilePath) {
		// Create default config
		nativeAppConfig = NativeConfig{ProgramPath: "C:\\Program Files\\MPC-HC\\mpc-hc64.exe"}
		if runtime.GOOS == "darwin" {
			nativeAppConfig = NativeConfig{ProgramPath: "/Applications/VLC.app/Contents/MacOS/VLC"} // VLC for macOS
		}
		out, _ := nativeAppConfig.toJson()
		ioutil.WriteFile(configFilePath, out, 0644)
	} else {
		jsonAsBytes, _ := ioutil.ReadFile(configFilePath)
		nativeAppConfig, _ = LoadConfigFromJson(jsonAsBytes)
	}

	nativeProgram := nativeAppConfig.ProgramPath

	if nativeProgram == "" {
		panic("ProgramPath is not defined")
	}

	res.Set(nativeProgram, "process")

	url, _ = strconv.Unquote(url) // VLC macOS doesn't understand double quotes
	cmd := exec.Command(nativeProgram, append([]string{url}, nativeAppConfig.Args...)...)

	err := cmd.Start()

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
