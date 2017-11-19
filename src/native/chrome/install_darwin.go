package chrome

import (
	"fmt"
	"log"
	"os/user"
	"path/filepath"
)

func Install(path string) {
	fmt.Println("Yeah macOS: " + path)
	updateFilePath(path)
}

func getJSONPath(_ string) string {
	usr, err := user.Current()
	if err != nil {
		log.Fatal(err)
	}
	return filepath.Join(usr.HomeDir, "Library/Application Support/Google/Chrome/NativeMessagingHosts/", NameSpace+".json")
}
