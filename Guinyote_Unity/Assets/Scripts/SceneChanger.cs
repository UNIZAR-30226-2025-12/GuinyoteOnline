using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneChanger : MonoBehaviour
{
    public void ChangeScene(string scene)
    {
        SceneManager.LoadScene(scene);
    }
}