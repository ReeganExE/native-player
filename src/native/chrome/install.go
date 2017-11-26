package chrome

import (
	"fmt"
	"io/ioutil"
	"path/filepath"

	"github.com/Jeffail/gabs"
)

var initialJSON = `
{
	"allowed_origins": [
	  "chrome-extension://kciepmbhedijffapmcgbdadcbfjbkpng/",
	  "chrome-extension://boickpmdjgkjfmjnekkbaalodkdeheoc/"
	],
	"description": "Fshare Player",
	"name": "` + NameSpace + `",
	"path": "fake/path/https.exe",
	"type": "stdio"
	}`

// NameSpace namespace on chrome
var NameSpace = "org.js.ninh.nplayer"

func updateFilePath(exePath string) string {
	manifest, err := gabs.ParseJSON([]byte(initialJSON))

	if err != nil {
		panic(err)
	}

	manifest.Set(exePath, "path")
	json := manifest.StringIndent("", "  ")
	fmt.Println(json)

	exe, _ := filepath.Abs(exePath)

	jsonPath := getJSONPath(exe)

	ioutil.WriteFile(jsonPath, []byte(json), 0644)
	return jsonPath
}
