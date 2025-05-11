using UnityEngine;

public class ConsoleToGUI : MonoBehaviour
{
    string myLog = "*begin log";
    string filename = "";
    bool doShow = false;
    int kChars = 700;
    void OnEnable()
    {
        Application.logMessageReceivedThreaded += Log;
    }
    void OnDisable()
    {
        Application.logMessageReceivedThreaded -= Log;
    }
    void Update() { if (Input.GetKeyDown(KeyCode.Space)) { doShow = !doShow; } }
    public void Log(string logString, string stackTrace, LogType type)
    {
        // Agrega el stackTrace si es un error o excepción
        if (type == LogType.Error || type == LogType.Exception)
        {
            logString += "\n" + stackTrace;
        }

        // Para mostrar en pantalla...
        myLog = myLog + "\n" + logString;
        if (myLog.Length > kChars) { myLog = myLog.Substring(myLog.Length - kChars); }

        // Para guardar en archivo...
        if (filename == "")
        {
            string d = System.Environment.GetFolderPath(
            System.Environment.SpecialFolder.Desktop) + "/YOUR_LOGS";
            System.IO.Directory.CreateDirectory(d);
            string r = Random.Range(1000, 9999).ToString();
            filename = d + "/log-" + r + ".txt";
        }

        try { System.IO.File.AppendAllText(filename, logString + "\n"); }
        catch { }
    }

    void OnGUI()
    {
        if (!doShow) { return; }
        GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity,
           new Vector3(Screen.width / 1200.0f, Screen.height / 800.0f, 1.0f));
        GUI.TextArea(new Rect(10, 10, 540, 370), myLog);
    }
}