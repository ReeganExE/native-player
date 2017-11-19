package chrome

import (
	"fmt"
	"path/filepath"

	"golang.org/x/sys/windows/registry"
)

func Install(path string) {
	fmt.Println("Yeah windows: " + path)
	jsonPath := updateFilePath(path)

	register(jsonPath)
}

func register(path string) {
	key := `Software\Google\Chrome\NativeMessagingHosts\` + NameSpace
	k, _, e := registry.CreateKey(registry.CURRENT_USER, key, registry.ALL_ACCESS)
	if e != nil {
		panic(e)
	}
	defer k.Close()

	k.SetStringValue("", path)
}

func getJSONPath(exePath string) string {
	return filepath.Join(filepath.Dir(exePath), "manifest.json")
}
