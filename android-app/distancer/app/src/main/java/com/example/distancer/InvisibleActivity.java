//package com.example.distancer;
//
//import android.app.Activity;
//import android.os.Bundle;
////import android.os.Build;
//import android.view.View;
//import android.webkit.WebSettings;
//import android.webkit.WebView;
//
//public class InvisibleActivity extends Activity {
//
//    private static WebView webViewInstance;
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//
//        // Прячем Activity
//        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
//                | View.SYSTEM_UI_FLAG_FULLSCREEN);
//
//        webViewInstance = new WebView(this);
//        setContentView(webViewInstance);
//
//        WebSettings webSettings = webViewInstance.getSettings();
//        webSettings.setJavaScriptEnabled(true);
//
//        // Загружаем локальный HTML (предположим, он в assets)
//        webViewInstance.loadUrl("file:///android_asset/index.html");
//
//        // Включить фоновую работу
//        webViewInstance.setKeepScreenOn(true);
//        webSettings.setDomStorageEnabled(true);
//
////        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
////            webViewInstance.setOffscreenPreRaster(true);
////        }
//    }
//
//    public static WebView getWebViewInstance() {
//        return webViewInstance;
//    }
//
//    @Override
//    protected void onDestroy() {
//        super.onDestroy();
//        if (webViewInstance != null) {
//            webViewInstance.destroy();
//            webViewInstance = null;
//        }
//    }
//}