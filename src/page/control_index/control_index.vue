<template>
    <div class="control-iIndex">
        <!-- <img class="control-logo" src="../../assets/veda_logo_black.png"/> -->
        <h1>欢迎回来</h1>
    </div>
</template>
<script>
    export default {
        name: 'controlIndex',
        data() {
            return {
            }
        },
        methods: {
        },
        beforeMount: function () {
        }
    }
</script>
<style>
.control-iIndex h1 {
    font-size: 52px;
    text-align: center;
    color: #475b71;
    font-weight: 900;
    margin: 0;
    margin-top: 50px;
}
.control-iIndex .control-logo {
    display: block;
    margin: auto;
    width: 400px;
    height: auto;
    margin-top: 50px;
    opacity: .5;
}
</style>