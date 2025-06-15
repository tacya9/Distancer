package com.example.distancer;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.WindowManager;

import android.Manifest;
import android.content.pm.PackageManager;
import android.content.Intent;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity {

    private static final int REQUEST_LOCATION = 1;

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Запускаем фоновый сервис
//        Intent serviceIntent = new Intent(this, MyBackgroundService.class);
//        startForegroundService(serviceIntent);

//        Intent serviceIntent = new Intent(this, LocationService.class);
//        ContextCompat.startForegroundService(this, serviceIntent);


        // Запрашиваем разрешение на геолокацию, если нужно
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    REQUEST_LOCATION);
        }
//        if (ContextCompat.checkSelfPermission(this, Manifest.permission.FOREGROUND_SERVICE_LOCATION)
//                != PackageManager.PERMISSION_GRANTED) {
//            ActivityCompat.requestPermissions(this,
//                    new String[]{Manifest.permission.FOREGROUND_SERVICE_LOCATION},
//                    REQUEST_LOCATION);
//        }

        // Отключаем спящий режим
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        WebView webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setGeolocationEnabled(true);

        // Важно: разрешаем геолокацию в WebView
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, android.webkit.GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false); // автоматическое разрешение
            }
        });

        webView.setWebViewClient(new WebViewClient());

        webView.loadUrl("file:///android_asset/index.html");
    }
}




//package com.example.distancer;
//
//import android.annotation.SuppressLint;
//import android.content.pm.PackageManager;
//import android.os.Bundle;
//import android.webkit.WebChromeClient;
//import android.webkit.WebSettings;
//import android.webkit.WebView;
//import android.webkit.WebViewClient;
//import android.view.WindowManager;
//
//import androidx.appcompat.app.AppCompatActivity;
//
//public class MainActivity extends AppCompatActivity {
//
//    private static final int REQUEST_LOCATION = 1;
//
//    @Override
//    protected void onStart() {
//        super.onStart();
//        if (checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION)
//                != PackageManager.PERMISSION_GRANTED) {
//            requestPermissions(new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_LOCATION);
//        }
//    }
//
//    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//
//        // Отключаем спящий режим
//        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
//
//        WebView webView = new WebView(this);
//        setContentView(webView);
//
//        WebSettings settings = webView.getSettings();
//        settings.setJavaScriptEnabled(true);
//        settings.setDomStorageEnabled(true);
//        settings.setGeolocationEnabled(true);
//
//        // Ключевая часть: разрешаем WebView использовать геолокацию
//        webView.setWebChromeClient(new WebChromeClient() {
//            @Override
//            public void onGeolocationPermissionsShowPrompt(String origin, android.webkit.GeolocationPermissions.Callback callback) {
//                callback.invoke(origin, true, false); // Автоматически разрешаем
//            }
//        });
//
//        webView.setWebViewClient(new WebViewClient());
//
//        // Загружаем локальный HTML из assets
//        webView.loadUrl("file:///android_asset/index.html");
//    }
//}
