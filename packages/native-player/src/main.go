//go:generate goversioninfo -icon=icon.ico

package main

import (
	"bytes"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"

	"io/ioutil"

	"./chrome"
	"./writer"
	"strings"
)

func main() {
	if len(os.Args) > 1 && os.Args[1] == "install" {
		install()
		return
	}

	defer replyWithError()

	var request = Read()
	var response = new(Message)

	if request.Type == "PLAY" {
		var url = request.Payload
		response.Payload = play(url)
	} else if request.Type == "GET_CONFIG" {
		nativeConfig := readConfig()
		// Add host path to the response
		config := HostConfig{ NativeConfig: nativeConfig }
		config.HostPath, _ = os.Executable()
		json, _ := config.toJson()
		response.Payload = string(json)
	} else if request.Type == "SET_CONFIG" {
		r, e := parseConfig([]byte(request.Payload))
		if e != nil {
			panic("Failed " + e.Error() + " --> " + request.Payload)
		} else {
			writeConfig(&r)
		}
	}

	response.Type = "OK"
	respond(response)
}

func writeConfig(config *NativeConfig) {
	config.writeFile(defaultConfigPath())
}

func readConfig() *NativeConfig {
	var nativeAppConfig NativeConfig
	configFilePath := defaultConfigPath()
	// Check and create conf.ini file
	if !exists(configFilePath) {
		// Create default config
		nativeAppConfig = NativeConfig{ProgramPath: "C:\\Program Files\\MPC-HC\\mpc-hc64.exe"}
		if runtime.GOOS == "darwin" {
			nativeAppConfig = NativeConfig{ProgramPath: "/Applications/VLC.app/Contents/MacOS/VLC"} // VLC for macOS
		}
		nativeAppConfig.writeFile(configFilePath)
	} else {
		jsonAsBytes, _ := ioutil.ReadFile(configFilePath)
		nativeAppConfig, _ = parseConfig(jsonAsBytes)
	}

	return &nativeAppConfig
}

func defaultConfigPath() string {
	dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	configFilePath := filepath.Join(dir, "./conf.json")
	return configFilePath
}

func play(url string) string {
	var buffer bytes.Buffer

	var nativeAppConfig = readConfig()

	Log(url)

	buffer.WriteString("URL: " + url)
	nativeProgram := nativeAppConfig.ProgramPath
	if nativeProgram == "" {
		panic("ProgramPath is not defined")
	}

	buffer.WriteString(". Using program: " + nativeProgram)

	unquoted, e := strconv.Unquote(url) // VLC macOS doesn't understand double quotes

	if e == nil {
		url = unquoted
	}

	args := append([]string{url}, nativeAppConfig.Args...)

	buffer.WriteString(" " + strings.Join(args, " "))

	cmd := exec.Command(nativeProgram, args...)
	err := cmd.Start()
	if err != nil {
		panic("Cannot start: " + err.Error())
	}

	buffer.WriteString(". Process ID: " + strconv.Itoa(cmd.Process.Pid))

	cmd.Process.Release()

	return buffer.String()
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
		var res = Message{Payload: err, Type: "ERROR"}
		respond(&res)
	}
}

func respond(json *Message) {
	writer.NewWriter(os.Stdout).WriteJSON(json)
}
