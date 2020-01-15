package writer

import (
	"bytes"
	"encoding/binary"
	"encoding/json"
	"io"
)

type ChromeWriter struct {
	w io.Writer
}

func NewWriter(w io.Writer) *ChromeWriter  {
	return &ChromeWriter{w}
}

func (w *ChromeWriter) Write(v []byte) error {
	e := binary.Write(w.w, binary.LittleEndian, uint32(len(v)))

	if e != nil {
		return e
	}

	var msgBuf bytes.Buffer
	msgBuf.Write(v)
	_, e = msgBuf.WriteTo(w.w)
	return e
}

func (w *ChromeWriter) WriteString(v string) error {
	return w.Write([]byte(v))
}

func (w *ChromeWriter) WriteJSON(v interface{}) error {
	data, e := json.Marshal(v)
	if e != nil {
		return e
	}
	return w.Write(data)
}
