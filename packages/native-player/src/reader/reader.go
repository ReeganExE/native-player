package reader

import (
	"bufio"
	"bytes"
	"encoding/binary"
	"encoding/json"
	"io"
)

type ChromeReader struct {
	r io.Reader
}

func NewReader(r io.Reader) *ChromeReader  {
	return &ChromeReader{r}
}

func (r *ChromeReader) Read() (e error, value []byte)  {
	s := bufio.NewReader(r.r)
	lengthBytes := make([]byte, 4)

	if _, e = s.Read(lengthBytes); e != nil {
		return
	}

	content := make([]byte, readMessageLength(lengthBytes))
	if _, e = s.Read(content); e != nil {
		return
	}
	return nil, content
}

func (r *ChromeReader) ReadAsJSON(v interface{}) error  {
	e, content := r.Read()
	if e != nil {
		return e
	}

	return json.Unmarshal(content, v)
}

func readMessageLength(msg []byte) int {
	var length uint32
	buf := bytes.NewBuffer(msg)
	binary.Read(buf, binary.LittleEndian, &length)
	return int(length)
}
